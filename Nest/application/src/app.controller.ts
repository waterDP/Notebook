/*
 * @Author: water.li
 * @Date: 2024-11-22 21:27:39
 * @Description:
 * @FilePath: \Notebook\Nest\application\src\app.controller.ts
 */
import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
