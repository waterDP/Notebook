/*
 * @Author: water.li
 * @Date: 2024-06-27 21:22:33
 * @Description:
 * @FilePath: \Notebook\Nest\src\@nestjs\core\nest-application.ts
 */
import "reflect-metadata";
import express, {
  Express,
  Request as ExpressRequest,
  Response as ExpressResponse,
  NextFunction,
  response,
} from "express";
import { Logger } from "./logger";
import path from "path";
import { INJECTED_TOKENS, DESIGN_PARAMTYPES } from "../common/constants";
import { defineModule } from "../common/module.decorator";

export class NestApplication {
  // 在它的内部私有化一个Express实例
  private readonly app: Express = express();
  // 在此处保存所有provider的实例，key就是token，值就是类的实例或者值
  private readonly providerInstance = new Map();
  private readonly globalProviders = new Set();
  // 记录每个模块里有哪些provider的token
  private readonly moduleProviders = new Map();
  constructor(protected readonly module) {
    this.app.use(express.json()); // 用来把json格式的请求体对象，放在req.body上
    this.app.use(express.urlencoded({ extended: true })); // 把form表单格式的请求体对象放在body上
  }
  async initProviders() {
    const imports = Reflect.getMetadata("imports", this.module) ?? [];
    //遍历所有导入的模块
    for (const importModule of imports) {
      let importedModule = importModule;
      // 如果导入的是一个Promise，说明它是异步的动态模块
      if (importModule instanceof Promise) {
        importedModule = await importedModule;
      }
      // 如果导入的模块有module属性，说明这是一个动态模块
      if ("module" in importedModule) {
        const { module, providers, exports, controllers } = importModule;

        const oldControllers = Reflect.getMetadata("controllers", module);
        const newControllers = [
          ...(oldControllers ?? []),
          ...(controllers ?? []),
        ];

        const oldProviders = Reflect.getMetadata("providers", module);
        const newProviders = [...(oldProviders ?? []), ...(providers ?? [])];

        const oldExports = Reflect.getMetadata("exports", module);
        const newExports = [...(oldExports ?? []), ...(exports ?? [])];

        defineModule(module, newControllers);
        defineModule(module, newProviders);

        Reflect.defineMetadata("controllers", newControllers, module);
        Reflect.defineMetadata("providers", newProviders, module);
        Reflect.defineMetadata("exports", newExports, module);

        this.registerProviderFromModule(module, this.module);
      } else {
        this.registerProviderFromModule(importModule);
      }
    }
    // 获取当前模块提供的元数据
    const providers = Reflect.getMetadata("providers", this.module) ?? [];
    for (const provider of providers) {
      this.addProvider(provider, this.module);
    }
  }
  private registerProviderFromModule(module, ...parentModules) {
    // 获取导入的是不是全局模块
    const global = Reflect.getMetadata("global", module);
    const importedProviders = Reflect.getMetadata("providers", module) ?? [];
    const exports = Reflect.getMetadata("exports", module) ?? [];
    for (const exportToken of exports) {
      if (this.isModule(exportToken)) {
        this.registerProviderFromModule(exportToken, module, ...parentModules);
      } else {
        const provider = importedProviders.find(
          (provider) =>
            provider === exportToken || provider.provide === exportToken
        );
        if (provider) {
          [module, ...parentModules].forEach((module) => {
            this.addProvider(provider, module, global);
          });
        }
      }
    }
  }
  private isModule(exportToken) {
    return (
      exportToken &&
      exportToken instanceof Function &&
      Reflect.getMetadata("isModule", exportToken)
    );
  }
  addProvider(provider, module, global = false) {
    const providers = global
      ? this.globalProviders
      : this.providerInstance.get(module) || new Set();

    const injectToken = provider.provide ?? provider;
    if (this.providerInstance.has(injectToken)) {
      providers.add(injectToken);
      return;
    }

    if (!this.moduleProviders.has(module)) {
      this.moduleProviders.set(module, providers);
    }

    if (provider.provid && provider.useClass) {
      const Clazz = provider.useClass;
      const dependencies = this.resolveDependencies(Clazz);
      const classInstance = new Clazz(...dependencies);
      this.providerInstance.set(provider.provide, classInstance);
      providers.add(provider.provide);
    } else if (provider.provide && provider.useValue) {
      this.providerInstance.set(provider.provide, provider.useValue);
      providers.add(provider.provide);
    } else if (provider.provide && provider.useFactory) {
      const inject = provider.inject ?? [];
      const injectedValues = inject.map((injectToken) =>
        this.getProviderByToken(injectToken, module)
      );
      const value = provider.useFactory(...injectedValues);
      this.providerInstance.set(provider.provide, value);
      providers.add(provider.provide);
    } else {
      const dependencies = this.resolveDependencies(provider);
      const value = new provider(...dependencies);
      this.providerInstance.set(provider, value);
      providers.add(provider);
    }
  }
  use(middleware: any) {
    this.app.use(middleware);
  }
  private getProviderByToken = (injectedToken, module) => {
    if (
      this.moduleProviders.get(module)?.has(injectedToken) ||
      this.globalProviders.has(injectedToken)
    ) {
      return this.providerInstance.get(injectedToken);
    }
  };
  private resolveDependencies(Clazz) {
    // 取得注入的token
    const injectTokens = Reflect.getMetadata(INJECTED_TOKENS, Clazz) ?? [];
    // 取得构造函数的参数类型
    const constructorParams = Reflect.getMetadata(DESIGN_PARAMTYPES, Clazz);

    return constructorParams.map((param, index) => {
      const module = Reflect.getMetadata("module", Clazz);
      return this.getProviderByToken(injectTokens[index] ?? param, module);
    });
  }
  // 配置初始化工作
  async init() {
    //取出模块里所有的控制器，然后做好路由配置
    const controllers = Reflect.getMetadata("controllers", this.module) || [];
    Logger.log("AppModule dependencies initialized", "InstanceLoader");
    for (const Controller of controllers) {
      // 解析出控制器的依赖
      const dependencies = this.resolveDependencies(Controller);
      // 创建控制器的实例
      const controller = new Controller(...dependencies);
      // 获取前缀
      const prefix = Reflect.getMetadata("prefix", Controller) || "/";
      // 开始解析路由
      Logger.log(`${Controller.name} {${prefix}}`, "RoutesResolver");
      const controllerPrototype = Controller.prototype;
      for (const methodName of Object.getOwnPropertyNames(
        controllerPrototype
      )) {
        const method = controllerPrototype[methodName];
        const httpMethod = Reflect.getMetadata("method", method);
        const pathMetadata = Reflect.getMetadata("path", method);
        const redirectUrl = Reflect.getMetadata("redirectUrl", method);
        const redirectStatusCode = Reflect.getMetadata(
          "redirectStatusCode",
          method
        );
        const statusCode = Reflect.getMetadata("statusCode", method);
        const headers = Reflect.getMetadata("headers", method) ?? [];

        // 如果方法名不存在，则不处理
        if (!httpMethod) continue;
        const routePath = path.posix.join("/", prefix, pathMetadata);
        // 配置路由，当客端以httpMethod方法请求routePath路径的时候，会由对应的函数进行处理
        this.app[httpMethod.toLowerCase()](
          routePath,
          (req: ExpressRequest, res: ExpressResponse, next: NextFunction) => {
            const args = this.resolveParams(
              controller,
              methodName,
              req,
              res,
              next
            );
            const result = method.call(controller, ...args);
            if (result.url) {
              return res.redirect(result.redirectCode || 302, result.url);
            }
            // 判断如果需要重定向，则直接重定向到指定的redirectUrl地址去
            if (redirectUrl) {
              return res.redirect(redirectStatusCode || 302, redirectUrl);
            }

            if (statusCode) {
              res.statusCode = statusCode;
            } else if (httpMethod === "POST") {
              res.statusCode = 201;
            }

            const responseMetadata = this.getResponseMetaData(
              controller,
              methodName
            );
            // 或者没有注入Response装饰器，或者注入了但传入passthrough参数，都会由Nest.js来返回响应
            if (!responseMetadata || responseMetadata?.data?.passthrough) {
              headers.forEach(({ name, value }) => {
                res.setHeader(name, value);
              });
              res.send(result);
            }
          }
        );
        Logger.log(
          `Mapped {${routePath}, ${httpMethod}} route`,
          "RoutesResolver"
        );
      }
      Logger.log(`Nest application successfully started`, "NestApplication");
    }
  }
  private getResponseMetaData(controller, methodName) {
    const paramsMetadata = Reflect.getMetadata(
      "params",
      controller,
      methodName
    );
    return paramsMetadata
      .filter(Boolean)
      .find(
        (params) =>
          params.key === "Response" ||
          params.key === "res" ||
          params.key === "Next"
      );
  }
  private resolveParams(
    instance: any,
    methodName: string,
    req: ExpressRequest,
    res: ExpressResponse,
    next: NextFunction
  ) {
    // 获取参数的原数据
    const paramsMetadata =
      Reflect.getMetadata("params", instance, methodName) ?? [];
    return paramsMetadata.map((paramMetadata) => {
      const { key, data, factory } = paramMetadata;
      const ctx = {
        switchToHttp: () => {
          return {
            getRequest: () => req,
            getResponse: () => res,
            getNext: () => next,
          };
        },
      };
      switch (key) {
        case "Request":
        case "Req":
          return req;
        case "Query":
          return data ? req.query[data] : req.query;
        case "Headers":
          return data ? req.headers[data] : req.headers;
        case "Session":
          return data ? req.session[data] : req.session;
        case "Ip":
          return req.ip;
        case "Param":
          return data ? req.params[data] : req.params;
        case "Body":
          return data ? req.body[data] : req.body;
        case "Response":
        case "Res":
          return res;
        case "Next":
          return next;
        case "DecoratorFactory":
          return factory(data, ctx);
        default:
          return null;
      }
    });
  }
  // 启动HTTP服务器
  async listen(port) {
    await this.initProviders();
    await this.init();
    this.app.listen(port, () => {
      Logger.log(
        `Application is running on http://localhost:${port}`,
        "NestApplication"
      );
    });
  }
}
