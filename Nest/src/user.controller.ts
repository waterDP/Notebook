/*
 * @Author: water.li
 * @Date: 2024-06-23 22:22:19
 * @Description:
 * @FilePath: \Notebook\Nest\src\user.controller.ts
 */

import {
  Controller,
  Get,
  Req,
  Request,
  Query,
  Headers,
  Session,
  Ip,
  Param
} from "@nestjs/common";
import { Request as ExpressRequest } from "express";

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
    return `query is: ${id}`;
  }
  @Get("headers")
  handleHeader(@Headers() headers: any, @Headers("accept") accept: string) {
    console.log("headers", headers);
    console.log("accept", accept);
    return `accept: ${accept}`;
  }
  @Get("session")
  handleSession(
    @Session() session: any,
    @Session("pageView") pageView: string
  ) {
    console.log("session", session);
    console.log("pageView", pageView);
    if (session.pageView) {
      session.pageView++;
    } else {
      session.pageView = 1;
    }
    return `pageView: ${session.pageView}`;
  }
  @Get("ip")
  getUserIp(@Ip() ip: string) {
    console.log("Ip", ip);
    return `ip: ${ip}`;
  }
  @Get(":username/info/:age")
  getUserInfo(
    @Param() params: any,
    @Param("username") username: string,
    @Param("age") age: string
  ) {
    console.log("params", params);
    console.log("username", username);
    console.log("age", age);
    return `age: ${age}`;
  }
}
