/*
 * @Author: water.li
 * @Date: 2024-08-25 20:37:56
 * @Description:
 * @FilePath: \Notebook\Nest\src\forbidden.exception.ts
 */
import { HttpException, HttpStatus } from "@nestjs/common";

export class ForbiddenException extends HttpException {
  constructor() {
    super('Forbidden', HttpStatus.FORBIDDEN)
  }
}
