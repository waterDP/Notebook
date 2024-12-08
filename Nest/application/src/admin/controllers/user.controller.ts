import { Controller, Get } from '@nestjs/common';
import { ApiCookieAuth, ApiOperation } from '@nestjs/swagger';
import { UserService } from 'src/shared/services/user.service';

@Controller('admin/users')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Get()
  @ApiCookieAuth()
  @ApiOperation({ summary: '获取所有用户' })
  async findAll() {
    const users = await this.userService.findAll();
    return { users };
  }
}
