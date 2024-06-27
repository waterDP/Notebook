/*
 * @Author: water.li
 * @Date: 2024-06-27 21:22:33
 * @Description:
 * @FilePath: \Notebook\Nest\src\@nestjs\core\nest-application.ts
 */
import express, { Express } from "express";
import { Logger } from "./logger";

export class NestApplication {
  // 在它的内部私有化一个Express实例
  private readonly app: Express = express();
  constructor(protected readonly module) {}

  // 配置初始化工作
  async init() {}

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
