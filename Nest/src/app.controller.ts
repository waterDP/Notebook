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
}
