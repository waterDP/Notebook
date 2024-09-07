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
} from "express";
import { Logger } from "./logger";
import path from "path";
import { INJECTED_TOKENS, DESIGN_PARAMTYPES } from "../common/constants";
import { defineModule } from "../common/module.decorator";
import { RequestMethod } from "../common/request.method.enum";
import { ArgumentsHost } from "../common/arguments-host.interface";
import { GlobalHttpExceptionFilter } from "../common/http-exception.filter";
import {
  APP_FILTER,
  DECORATOR_FACTORY,
  APP_PIPE,
  FORBIDDEN_RESOURCE,
  APP_INTERCEPTOR,
} from "./constants";
import { PipeTransform } from "../common/pipe-transform.interface";
import { ExecutionContext } from "../common/execution-context.interface";
import { CanActivate } from "../common/can-activate.interface";
import { ForbiddenException } from "../common/http-exception";
import { Reflector } from "./reflector";
import { APP_GUARD } from "./constants";
import { from, mergeMap, Observable, of } from "rxjs";
import { NestInterceptor } from "../common/nest-interceptor.interface";

export class NestApplication {
  // 在它的内部私有化一个Express实例
  private readonly app: Express = express();
  // 在此处保存所有provider的实例，key就是token，值就是类的实例或者值
  private readonly providerInstance = new Map();
  private readonly globalProviders = new Set();
  // 记录每个模块里有哪些provider的token
  private readonly moduleProviders = new Map();
  // 记录所有的中间件
  private readonly middlewares = [];
  // 记录所有要排除的路径
  private readonly excludedRoutes = [];

  // 添加一个默认全局异常过滤器
  private readonly defaultGlobalHttpExceptionFilter =
    new GlobalHttpExceptionFilter();
  // 这里存放着的所有的全局异过滤器
  private readonly globalExceptionFilters = [];
  // 全局管道
  private readonly globalPipes: PipeTransform[] = [];
  // 全局守卫
  private readonly globalGuards: CanActivate[] = [];
  // 全局拦截器
  private readonly globalInterceptors: NestInterceptor[] = [];

  private readonly globalProviderMap = new Map([
    [APP_GUARD, new Map()],
    [APP_PIPE, new Map()],
    [APP_FILTER, new Map()],
    [APP_INTERCEPTOR, new Map()],
  ]);

  constructor(protected readonly module) {
    this.app.use(express.json()); // 用来把json格式的请求体对象，放在req.body上
    this.app.use(express.urlencoded({ extended: true })); // 把form表单格式的请求体对象放在body上
  }

  useGlobalPipes(...pipes: PipeTransform[]) {
    this.globalPipes.push(...pipes);
  }

  useGlobalFilters(...filters) {
    defineModule(
      this.module,
      filters.filter((filter) => filter instanceof Function)
    );
    this.globalExceptionFilters.push(...filters);
  }

  exclude(...routeInfos): this {
    this.excludedRoutes.push(...routeInfos.map(this.normalizeRouteInfo));
    return this;
  }
  private async initMiddlewares() {
    // 调用配置中间件的方法 MiddlewareConsumer就是当前的NestApplication的实例
    await this.module.prototype.configure?.(this);
  }
  apply(...middlewares) {
    defineModule(this.module, middlewares);
    // 把接收到的中间件放到中件数组中，并且返回当前的实例
    this.middlewares.push(middlewares);
    return this;
  }
  getMiddlewareInstance(middleware) {
    if (middleware instanceof Function) {
      const dependencies = this.resolveDependencies(middleware);
      return new middleware(...dependencies);
    }
    return middleware;
  }
  isExcluded(reqPath: string, method: RequestMethod) {
    return this.excludedRoutes.some((routeInfo) => {
      const { routePath, routeMethod } = routeInfo;
      return (
        routePath === reqPath &&
        (routeMethod === RequestMethod.ALL || routeMethod === method)
      );
    });
  }
  forRoutes(...routes): this {
    for (const route of routes) {
      for (const middleware of this.middlewares) {
        const { routePath, routeMethod } = this.normalizeRouteInfo(route);
        this.app.use(routePath, (req, res, next) => {
          if (this.isExcluded(req.originalUrl, req.method as RequestMethod)) {
            return next();
          }
          if (routeMethod === RequestMethod.ALL || routeMethod === req.method) {
            if ("use" in middleware.prototype || "use" in middleware) {
              const middlewareInstance = this.getMiddlewareInstance(middleware);
              middlewareInstance.use(req, res, next);
            } else if (middleware instanceof Function) {
              middleware(req, res, next);
            } else {
              next();
            }
          } else {
            next();
          }
        });
      }
    }
    this.middlewares.length = 0;
    return this;
  }
  private normalizeRouteInfo(route) {
    let routePath = "";
    let routeMethod = RequestMethod.ALL;
    if (typeof route === "string") {
      routePath = route;
    } else if ("path" in route) {
      routePath = route.path;
      routeMethod = route.method;
    } else if (route instanceof Function) {
      // 如果route是一个控制器的话，以它的路径前缀作为路径
      routePath = Reflect.getMetadata("prefix", route);
    }
    routePath = path.posix.join("/", routePath);
    return { routePath, routeMethod };
  }
  private addDefaultProviders() {
    this.addProvider(Reflector, this.module, true);
  }
  async initProviders() {
    this.addDefaultProviders();
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
      this.processProvider(provider, this.module);
    }
  }
  private processProvider(provider, module) {
    // 如果这是一个全局的token对应的provider
    if (this.globalProviderMap.has(provider.provide)) {
      let instanceMap = this.globalProviderMap.get(provider.provide);
      const { useClass } = provider;
      if (!instanceMap.has(useClass)) {
        const dependencies = this.resolveDependencies(useClass);
        const instance = new useClass(...dependencies);
        instanceMap.set(useClass, instance);
      }
    } else {
      this.addProvider(provider, module);
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
    this.initController(module);
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

    if (!global) {
      this.moduleProviders.set(module, providers);
    }

    const injectToken = provider.provide ?? provider;
    if (this.providerInstance.has(injectToken)) {
      providers.add(injectToken);
      return;
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
  private getGuardInstance(guard) {
    if (typeof guard === "function") {
      const dependencies = this.resolveDependencies(guard);
      return new guard(...dependencies);
    }
    return guard;
  }
  async callGuards(guards: CanActivate[], context: ExecutionContext) {
    for (const guard of guards) {
      const guardInstance = this.getGuardInstance(guard);
      const canActivate = await guardInstance.canActivate(context);
      if (!canActivate) {
        throw new ForbiddenException(FORBIDDEN_RESOURCE);
      }
    }
  }
  private getInterceptorInstance(interceptor) {
    if (typeof interceptor === "function") {
      const dependencies = this.resolveDependencies(interceptor);
      return new interceptor(...dependencies);
    }
    return interceptor;
  }
  callInterceptors(
    controller: any,
    method: Function,
    args: any[],
    interceptors: NestInterceptor[],
    context: ExecutionContext
  ) {
    const nextFn = (i = 0): Observable<any> => {
      if (i > interceptors.length) {
        const result = method.call(controller, ...args);
        return result instanceof Promise ? from(result) : of(result);
      }
      const handler = {
        handle: () => nextFn(i + 1),
      };
      const interceptor = this.getInterceptorInstance(interceptors[i]);
      const result = interceptor.intercept(context, handler);
      return from(result).pipe(
        mergeMap((res) => (res instanceof Observable ? res : of(res)))
      );
    };
    return nextFn();
  }
  // 配置初始化工作
  async initController(module) {
    //取出模块里所有的控制器，然后做好路由配置
    const controllers = Reflect.getMetadata("controllers", module) || [];
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
      // 获取控制器上绑定的异常过滤器
      const controllerFilters =
        Reflect.getMetadata("filters", Controller) ?? [];

      // 获取控制器上的管道数组
      const controllerPipes = Reflect.getMetadata("pipes", controller) ?? [];
      // 获取控制器上的守卫数组
      const controllerGuards = Reflect.getMetadata("guards", controller) ?? [];

      // 获取控制器上的拦截器数组
      const controllerInterceptors =
        Reflect.getMetadata("interceptors", controller) ?? [];

      defineModule(this.module, controllerFilters);

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
        // 获取方法上绑定的异常过滤器数组
        const methodFilters = Reflect.getMetadata("filters", method) ?? [];
        defineModule(this.module, methodFilters);

        // 获取方法上绑定的管道数组
        const methodPipes = Reflect.getMetadata("pipes", method) ?? [];
        const pipes = [...controllerPipes, ...methodPipes];

        // 获取方法的守卫数组
        const methodGuards = Reflect.getMetadata("guards", method) ?? [];
        const guards = [
          ...this.globalGuards,
          ...controllerGuards,
          ...methodGuards,
        ];

        // 获取方法的拦截器数组
        const methodInterceptors =
          Reflect.getMetadata("interceptors", method) ?? [];
        const interceptors = [
          ...this.globalInterceptors,
          ...controllerInterceptors,
          ...methodInterceptors,
        ];

        // 如果方法名不存在，则不处理
        if (!httpMethod) continue;
        const routePath = path.posix.join("/", prefix, pathMetadata);
        // 配置路由，当客端以httpMethod方法请求routePath路径的时候，会由对应的函数进行处理
        this.app[httpMethod.toLowerCase()](
          routePath,
          async (
            req: ExpressRequest,
            res: ExpressResponse,
            next: NextFunction
          ) => {
            const host: ArgumentsHost = {
              switchToHttp: () => {
                return {
                  getRequest: () => req,
                  getResponse: () => res,
                  getNext: () => next,
                };
              },
            };
            const context: ExecutionContext = {
              ...host,
              getClass: () => controller,
              getHandler: () => method,
            };
            try {
              await this.callGuards(guards, context);
              const args = await this.resolveParams(
                controller,
                methodName,
                context,
                host,
                pipes
              );
              this.callInterceptors(
                controller,
                method,
                args,
                interceptors,
                context
              ).subscribe({
                next: (result) => {
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
                  if (
                    !responseMetadata ||
                    responseMetadata?.data?.passthrough
                  ) {
                    headers.forEach(({ name, value }) => {
                      res.setHeader(name, value);
                    });
                    res.send(result);
                  }
                },
                error: (error) =>
                  this.callExceptionFilters(
                    error,
                    host,
                    methodFilters,
                    controllerFilters
                  ),
              });
            } catch (error) {
              await this.callExceptionFilters(
                error,
                host,
                methodFilters,
                controllerFilters
              );
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
  getFilterInstance(filter) {
    if (filter instanceof Function) {
      const dependencies = this.resolveDependencies(filter);
      return new filter(...dependencies);
    }
    return filter;
  }
  private callExceptionFilters(error, host, methodFilters, controllerFilters) {
    const allFilters = [
      ...methodFilters,
      ...controllerFilters,
      ...this.globalExceptionFilters,
      this.defaultGlobalHttpExceptionFilter,
    ];
    for (const filter of allFilters) {
      let filterInstance = filter;
      if (filterInstance instanceof Function) {
        filterInstance = this.getFilterInstance(filter);
      }
      const exceptions =
        Reflect.getMetadata("catch", filterInstance.constructor) ?? [];
      if (
        exceptions.length === 0 ||
        exceptions.some((exception) => error instanceof exception)
      ) {
        filterInstance.catch(error, host);
        break;
      }
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
    context: ExecutionContext,
    host: ArgumentsHost,
    pipes: PipeTransform[]
  ) {
    const { getRequest, getResponse, getNext } = context.switchToHttp();
    const req = getRequest();
    const res = getResponse();
    const next = getNext();
    // 获取参数的原数据
    const paramsMetadata =
      Reflect.getMetadata("params", instance, methodName) ?? [];
    return Promise.all(
      paramsMetadata.map(async (paramMetadata) => {
        const {
          key,
          data,
          factory,
          pipes: paramPipes,
          metatype,
        } = paramMetadata;
        let value: any;
        switch (key) {
          case "Request":
          case "Req":
            value = req;
            break;
          case "Query":
            value = data ? req.query[data] : req.query;
            break;
          case "Headers":
            value = data ? req.headers[data] : req.headers;
            break;
          case "Session":
            value = data ? req.session[data] : req.session;
            break;
          case "Ip":
            value = req.ip;
            break;
          case "Param":
            value = data ? req.params[data] : req.params;
            break;
          case "Body":
            value = data ? req.body[data] : req.body;
            break;
          case "Response":
          case "Res":
            value = res;
            break;
          case "Next":
            value = next;
            break;
          case DECORATOR_FACTORY:
            value = factory(data, host);
            break;
          default:
            value = null;
            break;
        }

        for (const pipe of [...this.globalPipes, ...pipes, ...paramPipes]) {
          const pipeInstance = this.getPipeInstance(pipe);
          const type = key === DECORATOR_FACTORY ? "custom" : key.toLowerCase();
          value = await pipeInstance.transform(value, { type, data, metatype });
        }
        return value;
      })
    );
  }
  private getPipeInstance(pipe) {
    if (typeof pipe === "function") {
      const dependencies = this.resolveDependencies(pipe);
      return new pipe(...dependencies);
    }
    return pipe;
  }
  public useGlobalGuards(...guards: CanActivate[]) {
    this.globalGuards.push(...guards);
  }
  public useGlobalInterceptors(...interceptors: NestInterceptor[]) {
    this.globalInterceptors.push(...interceptors);
  }
  private initGlobalProviders() {
    for (const [provide, instanceMap] of this.globalProviderMap) {
      switch (provide) {
        case APP_INTERCEPTOR:
          this.useGlobalInterceptors(...instanceMap.values());
          break;
        case APP_GUARD:
          this.useGlobalGuards(...instanceMap.values());
          break;
        case APP_PIPE:
          this.useGlobalPipes(...instanceMap.values());
          break;
        case APP_FILTER:
          this.useGlobalFilters(...instanceMap.values());
          break;
      }
    }
  }
  // 启动HTTP服务器
  async listen(port) {
    await this.initProviders(); // 注入Provider
    await this.initMiddlewares(); // 初始中间件配置
    await this.initGlobalProviders();
    await this.initController(this.module);
    this.app.listen(port, () => {
      Logger.log(
        `Application is running on http://localhost:${port}`,
        "NestApplication"
      );
    });
  }
}
