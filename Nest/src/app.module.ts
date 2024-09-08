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
  Post,
  FileTypeValidator,
} from "@nestjs/common";
import { AppController } from "./app.controller";
import { UserController } from "./user.controller";
import { LoggerService } from "./logger.service";
import { LoggerMiddleware } from "./logger.middleware";
import { loggerFunction } from "./logger.function.middleware";
import { UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "./@nestjs/platform-express/file.interceptor";
import { UploadedFile } from "@nestjs/common";
import { ParseFilePipe } from "@nestjs/common";
import { MaxFileSizeValidator } from "@nestjs/common";
import { MulterModule } from "@nest/platform-express"
@Module({
  imports: [
    MulterModule.register({
      dest: './upload'
    })
  ],
  controllers: [AppController, UserController],
  providers: [LoggerService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      //.apply(LoggerMiddleware)
      .apply(loggerFunction)
      .exclude({ path: "cats/create", method: RequestMethod.POST })
      .forRoutes({ path: "cats", method: RequestMethod.GET });
  }

  @Post("parse-file")
  @UseInterceptors(FileInterceptor("file"))
  parseFile(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 1024 * 400 }),
          new FileTypeValidator({ fileType: "image/png" }),
        ],
      })
    )
    file: Express.Multer.File
  ) {
    console.log("file", file);
    return { message: "uploaded" };
  }
}
