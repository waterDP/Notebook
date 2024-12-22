/*
 * @Author: water.li
 * @Date: 2024-11-23 22:38:48
 * @Description:
 * @FilePath: \Notebook\Nest\application\src\admin\controllers\user.controller.ts
 */
import { Controller, Post, Get, Redirect, Render, Body, UseFilters } from '@nestjs/common';
import { ApiCookieAuth, ApiOperation } from '@nestjs/swagger';
import { CreateUserDto } from 'src/shared/dtos/user.dto';
import { UserService } from 'src/shared/services/user.service';
import { AdminExceptionFilter } from '../filters/admin-exception-filter';

@UseFilters(AdminExceptionFilter)
@Controller('admin/users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @Render('user/user-list')
  async findAll() {
    const users = await this.userService.findAll();
    return { users };
  }

  @Get('create')
  @Render('user/user-form')
  createForm() {
    return { user: {} }
  }

  @Post()
  @Redirect('/admin/users')
  async create(@Body() createUserDto: CreateUserDto) {
    return { success: true }
  }
}
