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

export class NestApplication {
  // 在它的内部私有化一个Express实例
  private readonly app: Express = express();
  constructor(protected readonly module) {
    this.app.use(express.json()); // 用来把json格式的请求体对象，放在req.body上
    this.app.use(express.urlencoded({ extended: true })); // 把form表单格式的请求体对象放在body上
  }
  use(middleware: any) {
    this.app.use(middleware);
  }
  // 配置初始化工作
  async init() {
    //取出模块里所有的控制器，然后做好路由配置
    const controllers = Reflect.getMetadata("controllers", this.module) || [];
    Logger.log("AppModule dependencies initialized", "InstanceLoader");
    for (const Controller of controllers) {
      // 创建控制器的实例
      const controller = new Controller();
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
            const responseMetadata = this.getResponseMetaData(
              controller,
              methodName
            );
            // 或者没有注入Response装饰器，或者注入了但传入passthrough参数，都会由Nest.js来返回响应
            if (!responseMetadata || responseMetadata?.data?.passthrough) {
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
      .find((params) => params.key === "Response" || params.key === "res");
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
      const { key, data } = paramMetadata;
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
        default:
          return null;
      }
    });
  }
  // 启动HTTP服务器
  async listen(port) {
    await this.init();
    this.app.listen(port, () => {
      Logger.log(
        `Application is running on http://localhost:${port}`,
        "NestApplication"
      );
    });
  }
}
