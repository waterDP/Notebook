/*
 * @Author: water.li
 * @Date: 2024-09-07 17:45:06
 * @Description:
 * @FilePath: \Notebook\Nest\src\@nestjs\platform-express\file.interceptor.ts
 */
import { ExecutionContext, Injectable } from "@nestjs/common";
import {
  CallHandler,
  NestInterceptor,
} from "../common/nest-interceptor.interface";
import multer from "multer";
import { Request, Response } from "express";

export function FileInterceptor(fileName: string) {
  @Injectable()
  class FileInterceptor implements NestInterceptor {
    async intercept(context: ExecutionContext, next: CallHandler) {
      const request = context.switchToHttp().getRequest<Request>();
      const response = context.switchToHttp().getResponse<Response>();
      const upload = multer().single(fileName);
      // 使用Promise包装multer的单文件，上传中间件
      await new Promise<void>((resolve, reject) => {
        upload(request, response, (err) => {
          err ? reject(err) : resolve();
        });
      });
      // 等异步上传完成后再调用nest.handle()继续向后执行处理请求
      return next.handle();
    }
  }
  return new FileInterceptor();
}
