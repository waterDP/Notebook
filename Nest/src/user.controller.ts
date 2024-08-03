/*
 * @Author: water.li
 * @Date: 2024-06-23 22:22:19
 * @Description:
 * @FilePath: \Notebook\Nest\src\user.controller.ts
 */

import {
  Controller,
  Get,
  Post,
  Req,
  Request,
  Query,
  Headers,
  Session,
  Body,
  Ip,
  Param,
  Response,
  Next,
  Redirect,
  HttpCode,
  Header
} from "@nestjs/common";
import {
  Request as ExpressRequest,
  Response as ExpressResponse,
} from "express";

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
  @Post("create")
  @HttpCode(200)
  @Header("Cache-Control", "none") // 向客户端发送一个响应头
  createUser(@Body() createUserDto, @Body("username") username: string) {
    console.log(createUserDto);
    return "user created";
  }

  @Get("res")
  response(@Response() response: ExpressResponse) {
    console.log("response", response);
    return "response";
  }

  @Get("next")
  next(@Next() next) {
    console.log(next);
  }

  @Get("/redirect/req")
  @Redirect("/users", 301)
  handleRedirect() {}
}
