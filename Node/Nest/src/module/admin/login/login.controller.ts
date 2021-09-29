import { Controller, Get, Render } from '@nestjs/common';

@Controller('admin/login')
export class LoginController {
  @Get()
  @Render('admin/login')
  index() {
    return {}
  }
}
