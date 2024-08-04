/*
 * @Author: water.li
 * @Date: 2024-06-23 22:21:59
 * @Description:
 * @FilePath: \Notebook\Nest\src\app.module.ts
 */
import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { UserController } from "./user.controller";
import { LoggerService } from "./logger.service";
@Module({
  controllers: [AppController, UserController],
  providers: [LoggerService]
})
export class AppModule {}
