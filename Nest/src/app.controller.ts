import { Controller, Get } from "@nestjs/common";

@Controller("a")
export class AppController {
  @Get("b")
  getHello(): string {
    return "hello world";
  }
}
