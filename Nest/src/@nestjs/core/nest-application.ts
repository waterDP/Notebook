/*
 * @Author: water.li
 * @Date: 2024-06-27 21:22:33
 * @Description:
 * @FilePath: \Notebook\Nest\src\@nestjs\core\nest-application.ts
 */
import "reflect-metadata";
import express, { Express } from "express";
import { Logger } from "./logger";

export class NestApplication {
  // 在它的内部私有化一个Express实例
  private readonly app: Express = express();
  constructor(protected readonly module) {}

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
      Logger.log(`${Controller.name} {${prefix}}`, 'RoutesResolver')
    }
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
