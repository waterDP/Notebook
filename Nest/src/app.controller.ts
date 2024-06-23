/*
 * @Author: water.li
 * @Date: 2024-06-23 22:22:19
 * @Description:
 * @FilePath: \Notebook\Nest\src\app.controller.ts
 */

import { Controller, Get } from "@nestjs/common";

@Controller("a")
export class AppController {
  @Get("b")
  getHello(): string {
    return "hello";
  }
}
