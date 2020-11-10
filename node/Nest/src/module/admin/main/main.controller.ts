import { Controller, Get, Render } from '@nestjs/common';

@Controller('admin')
export class MainController {
  @Get()
  @Render('admin/main/index')
  index() {
    return {}
  }
}
