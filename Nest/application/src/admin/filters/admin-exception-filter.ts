/*
 * @Author: water.li
 * @Date: 2024-12-22 12:03:57
 * @Description:
 * @FilePath: \Notebook\Nest\application\src\admin\filters\admin-exception-filter.ts
 */

import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class AdminExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    let status = exception.getStatus();
    let message = exception.message;
    if (exception instanceof BadRequestException) {
      // 验证管道抛出的异常
      const exceptionBody: any = exception.getResponse();
      if (typeof exceptionBody === 'object' && exceptionBody.message) {
        message = exceptionBody.message.join(',');
        status = exceptionBody.statusCode;
      }
    }
    response.status(status).render('error', {
      message,
    });
  }
}
