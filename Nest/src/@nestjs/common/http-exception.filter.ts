import { HttpException } from "./http-exception";
import { ArgumentsHost } from "./arguments-host.interface";
import { ExceptionFilter } from "./exception-filter.interface";
import { Response } from "express";
import { HttpStatus } from "./http-status.enum";

export class GlobalHttpExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response: any = ctx.getResponse<Response>();
    if (exception instanceof HttpException) {
      if (typeof exception.getResponse() === "string") {
        const status = exception.getStatus();
        response.status(status).json({
          statusCode: status,
          message: exception.getResponse(),
        });
      } else {
        response.status(exception.getStatus()).json(exception.getResponse());
      }
    } else {
      return response.status(500).json({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: "Internal server error",
      });
    }
  }
}
