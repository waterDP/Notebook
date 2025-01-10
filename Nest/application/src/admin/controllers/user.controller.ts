/*
 * @Author: water.li
 * @Date: 2024-11-23 22:38:48
 * @Description:
 * @FilePath: \Notebook\Nest\application\src\admin\controllers\user.controller.ts
 */
import {
  Controller,
  Post,
  Get,
  Redirect,
  Render,
  Body,
  UseFilters,
  ParseIntPipe,
  Param,
  HttpException,
  Put,
} from '@nestjs/common';
import { ApiCookieAuth, ApiOperation } from '@nestjs/swagger';
import { CreateUserDto, UpdateUserDto } from 'src/shared/dtos/user.dto';
import { UserService } from 'src/shared/services/user.service';
import { AdminExceptionFilter } from '../filters/admin-exception-filter';
import { UtilityService } from 'src/shared/services/utility.service';

@UseFilters(AdminExceptionFilter)
@Controller('admin/users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly utilityService: UtilityService,
  ) {}

  @Get()
  @Render('user/user-list')
  async findAll() {
    const users = await this.userService.findAll();
    return { users };
  }

  @Get('create')
  @Render('user/user-form')
  createForm() {
    return { user: {} };
  }

  @Post()
  @Redirect('/admin/users')
  async create(@Body() createUserDto: CreateUserDto) {
    if (createUserDto.password) {
      // 加密密码
      createUserDto.password = await this.utilityService.hashPassword(
        createUserDto.password,
      );
    }
    await this.userService.create(createUserDto);
    return { success: true };
  }

  @Get(':id/edit')
  @Render('user/user-form')
  async editForm(@Param('id', ParseIntPipe) id: number) {
    const user = await this.userService.findOne({ where: { id } });
    if (!user) {
      throw new HttpException('user not found', 404);
    }
    return user;
  }

  @Put()
  @Redirect('/admin/users')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    if (updateUserDto.password) {
      // 加密密码
      updateUserDto.password = await this.utilityService.hashPassword(
        updateUserDto.password,
      );
    }
    await this.userService.update(id, updateUserDto);
    return { success: true };
  }
}
