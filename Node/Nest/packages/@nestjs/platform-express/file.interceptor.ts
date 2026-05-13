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
import { Request, Response } from "express";
import { BadRequestException } from "../common/http-exception";
import { MulterConfigService } from "./multer-config.service";

export function FileInterceptor(fileName: string) {
  @Injectable()
  class FileInterceptor implements NestInterceptor {
    constructor(readonly multerConfigService: MulterConfigService) {}
    async intercept(context: ExecutionContext, next: CallHandler) {
      const request = context.switchToHttp().getRequest<Request>();
      const response = context.switchToHttp().getResponse<Response>();
      const upload = this.multerConfigService
        .getMulterInstance()
        .single(fileName);
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
  return FileInterceptor;
}

export function FilesInterceptor(fileName: string, maxCount?: number) {
  @Injectable()
  class FilesInterceptor implements NestInterceptor {
    constructor(readonly multerConfigService: MulterConfigService) {}
    async intercept(context: ExecutionContext, next: CallHandler) {
      const request = context.switchToHttp().getRequest<Request>();
      const response = context.switchToHttp().getResponse<Response>();
      const upload = this.multerConfigService
        .getMulterInstance()
        .array(fileName, maxCount);
      // 使用Promise包装multer的多文件，上传中间件
      await new Promise<void>((resolve, reject) => {
        upload(request, response, (err) => {
          err ? reject(err) : resolve();
        });
      });
      // 等异步上传完成后再调用nest.handle()继续向后执行处理请求
      return next.handle();
    }
  }
  return FilesInterceptor;
}

export function FileFieldsInterceptor(uploadFields) {
  @Injectable()
  class FileFieldsInterceptor implements NestInterceptor {
    constructor(readonly multerConfigService: MulterConfigService) {}
    async intercept(context: ExecutionContext, next: CallHandler) {
      const request = context.switchToHttp().getRequest<Request>();
      const response = context.switchToHttp().getResponse<Response>();
      const upload = this.multerConfigService
        .getMulterInstance()
        .fields(uploadFields);
      // 使用Promise包装multer的多文件，上传中间件
      await new Promise<void>((resolve, reject) => {
        upload(request, response, (err) => {
          err ? reject(err) : resolve();
        });
      });
      // 等异步上传完成后再调用nest.handle()继续向后执行处理请求
      return next.handle();
    }
  }
  return FileFieldsInterceptor;
}

export function AnyFilesInterceptor() {
  @Injectable()
  class AnyFilesInterceptor implements NestInterceptor {
    constructor(readonly multerConfigService: MulterConfigService) {}
    async intercept(context: ExecutionContext, next: CallHandler) {
      const request = context.switchToHttp().getRequest<Request>();
      const response = context.switchToHttp().getResponse<Response>();
      const upload = this.multerConfigService.getMulterInstance().any();
      // 使用Promise包装multer的多文件，上传中间件
      await new Promise<void>((resolve, reject) => {
        upload(request, response, (err) => {
          err ? reject(err) : resolve();
        });
      });
      // 等异步上传完成后再调用nest.handle()继续向后执行处理请求
      return next.handle();
    }
  }
  return AnyFilesInterceptor;
}

export function NoFilesInterceptor() {
  @Injectable()
  class NoFilesInterceptor implements NestInterceptor {
    async intercept(context: ExecutionContext, next: CallHandler) {
      const request = context.switchToHttp().getRequest<Request>();
      const response = context.switchToHttp().getResponse<Response>();
      if (request.file || request.files) {
        throw new BadRequestException("Files are not allowed");
      }
      return next.handle();
    }
  }
  return NoFilesInterceptor;
}
