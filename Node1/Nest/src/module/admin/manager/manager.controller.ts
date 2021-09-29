import { Controller, Get } from '@nestjs/common';

@Controller('admin/manager')
export class ManagerController {
  @Get()
  index() {
    return '我是后台首页'
  }
}
