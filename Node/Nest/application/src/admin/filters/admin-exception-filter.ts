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
import { Request, Response } from 'express';
import { I18nService, I18nValidationException } from 'nestjs-i18n';

@Catch(HttpException)
export class AdminExceptionFilter implements ExceptionFilter {
  constructor(private readonly i18n: I18nService) {}
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request: any = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();
    let status = exception.getStatus();
    let message = exception.message;
    if (exception instanceof BadRequestException) {
      // 验证管道抛出的异常
      const exceptionBody: any = exception.getResponse();
      if (typeof exceptionBody === 'object' && exceptionBody.message) {
        message = exceptionBody.message.join(',');
        status = exceptionBody.statusCode;
      } else if (exception instanceof I18nValidationException) {
        const errors = exception.errors;
        message = errors
          .map((error) => this.formatErrorMessage(error, request.i18nLang))
          .join(',');
      }
    }
    response.status(status).render('error', {
      message,
    });
  }
  formatErrorMessage(error: any, lang): string {
    const { property, value, constraints } = error;
    const contraintValues = Object.values(constraints);
    const formatedMessages = contraintValues.map((constraintValue: string) => {
      const [key, params] = constraintValue.split('|');
      if (params) {
        const parsedParams = JSON.parse(params);
        return this.i18n.translate(key, {
          lang,
          args: parsedParams,
        });
      }
    });
    return `${property}:${value} ${formatedMessages.join(', ')}`;
  }
}
