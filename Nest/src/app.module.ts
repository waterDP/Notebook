/*
 * @Author: water.li
 * @Date: 2024-06-23 22:21:59
 * @Description:
 * @FilePath: \Notebook\Nest\src\app.module.ts
 */
import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { UserController } from "./user.controller";

@Module({
  controllers: [AppController, UserController],
})
export class AppModule {}
