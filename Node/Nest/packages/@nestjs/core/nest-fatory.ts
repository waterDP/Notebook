/*
 * @Author: water.li
 * @Date: 2024-06-27 21:08:26
 * @Description: 
 * @FilePath: \Notebook\Nest\src\@nestjs\core\nest-fatory.ts
 */
import { Logger } from "./logger";
import { NestApplication } from "./nest-application";
export class NestFactory {
  static async create(module: any) {
    Logger.log("Starting Nest application...", "NestFactory");
    const app = new NestApplication(module);
    return app;
  }
}
  