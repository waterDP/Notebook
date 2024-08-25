/*
 * @Author: water.li
 * @Date: 2024-08-25 17:58:09
 * @Description:
 * @FilePath: \Notebook\Nest\src\@nestjs\common\http-exception.ts
 */

import { HttpStatus } from "./http-status.enum";

export class HttpException extends Error {
  private readonly response: string | object;
  private readonly status: HttpStatus;
  constructor(response: string | object, status: HttpStatus) {
    super();
    this.response = response;
    this.status = status;
  }
  getResponse() {
    return this.response;
  }
  getStatus() {
    return this.status;
  }
}

export class BadRequestException extends HttpException {
  constructor(message, error) {
    super(
      { message, error, statusCode: HttpStatus.BAD_REQUEST },
      HttpStatus.BAD_REQUEST
    );
  }
}

export class ForbiddenException extends HttpException {
  constructor(message, error) {
    super(
      { message, error, statusCode: HttpStatus.FORBIDDEN },
      HttpStatus.FORBIDDEN
    );
  }
}

export class RequestTimeoutException extends HttpException {
  constructor(message, error) {
    super(
      { message, error, statusCode: HttpStatus.REQUEST_TIMOUT },
      HttpStatus.REQUEST_TIMOUT
    );
  }
}
