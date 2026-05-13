/*
 * @Author: water.li
 * @Date: 2024-06-23 22:22:19
 * @Description:
 * @FilePath: \Notebook\Nest\src\app.controller.ts
 */

import { Body, Controller, Get, Post, UsePipes } from "@nestjs/common";
import { LoggerService } from "./logger.service";
import { ZodValidationPipe } from "./zod-validation.pipe";
import { createCatSchema, CreateCatDto } from "./create-cat";
import { ClassValidationPipe } from "./class-validation.pipe";
import { CreateUserDto } from "./create-user.dto";

@Controller()
export class AppController {
  constructor(private loggerService: LoggerService) {}

  @Get()
  getHello(): string {
    return "hello";
  }
  @Get("info")
  main() {
    return "info";
  }
  @Post("cats")
  @UsePipes(new ZodValidationPipe(createCatSchema))
  async createCat(@Body() createCatDto: CreateCatDto) {
    return "This action adds a new cat";
  }

  @Post("user/create")
  @UsePipes(new ClassValidationPipe())
  async createUser(@Body() createUserDto: CreateUserDto) {
    return "This action adds a new user";
  }
}
