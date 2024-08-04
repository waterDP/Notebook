/*
 * @Author: water.li
 * @Date: 2024-06-23 22:22:19
 * @Description:
 * @FilePath: \Notebook\Nest\src\app.controller.ts
 */

import { Controller, Get } from "@nestjs/common";
import { LoggerService } from './logger.service';

@Controller()
export class AppController {
  constructor (private loggerService: LoggerService) {
    
  }

  @Get()
  getHello(): string {
    return "hello";
  }
  @Get("info")
  main() {
    return "info";
  }
}
