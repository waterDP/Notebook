/*
 * @Author: water.li
 * @Date: 2024-06-23 22:22:19
 * @Description:
 * @FilePath: \Notebook\Nest\src\user.controller.ts
 */

import { Controller, Get, Req, Request } from "@nestjs/common";
import { Request as ExpressRequest } from "express";

@Controller("users")
export class UserController {
  @Get("req")
  handleRequest(
    @Req() req: ExpressRequest,
    @Request() request: ExpressRequest
  ) {}
}
