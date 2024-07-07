/*
 * @Author: water.li
 * @Date: 2024-06-23 22:22:19
 * @Description:
 * @FilePath: \Notebook\Nest\src\user.controller.ts
 */

import { Controller, Get, Req, Request, Query } from "@nestjs/common";
import { Request as ExpressRequest, query } from "express";

@Controller("users")
export class UserController {
  @Get("req")
  handleRequest(
    @Req() req: ExpressRequest,
    @Request() request: ExpressRequest
  ) {}
  @Get("query")
  handleQuery(@Query() query: any, @Query("id") id: string) {
    console.log("query", query);
    console.log("id", id);
    return `query is: ${id}`
  }
}
