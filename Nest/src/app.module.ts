/*
 * @Author: water.li
 * @Date: 2024-06-23 22:21:59
 * @Description:
 * @FilePath: \Notebook\Nest\src\app.module.ts
 */
import {
  MiddlewareConsumer,
  NestModule,
  Module,
  RequestMethod,
} from "@nestjs/common";
import { AppController } from "./app.controller";
import { UserController } from "./user.controller";
import { LoggerService } from "./logger.service";
import { LoggerMiddleware } from "./logger.middleware";
@Module({
  controllers: [AppController, UserController],
  providers: [LoggerService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes({ path: "cats", method: RequestMethod.GET });
  }
}
