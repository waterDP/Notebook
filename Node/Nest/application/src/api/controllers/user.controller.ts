import {
  Logger,
  applyDecorators,
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
  SerializeOptions,
  UseInterceptors,
  Inject,
  LoggerService,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreateUserDto, UpdateUserDto } from 'src/shared/dtos/user.dto';
import { User } from 'src/shared/entities/user.entities';
import { UserService } from 'src/shared/services/user.service';
import { Result } from 'src/shared/vo/result';

@Controller('api/users')
@SerializeOptions({
  strategy: 'excludeAll', // 'excludeAll' | 'exposeAll'
})
@UseInterceptors(ClassSerializerInterceptor)
@ApiTags('api/users')
export class UserController {
  private readonly logger = new Logger(UserController.name)
  constructor(private readonly userService: UserService) {}

  @Get()
  @ApiFindAll()
  async findAll() {
    this.logger.error('这是Nest内置的日志记录器')
    return this.userService.findAll();
  }

  @Get(':id')
  @ApiFindOne()
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const result = await this.userService.findOne({ where: { id } });
    if (result) {
      return { success: true, data: result };
    } else {
      throw new HttpException('用户未找到', HttpStatus.NOT_FOUND);
    }
  }

  @Post()
  @ApiCreate()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Put(':id')
  @ApiUpdate()
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    const result = await this.userService.update(id, updateUserDto);
    if (result.affected) {
      return Result.success('更新成功');
    } else {
      throw new HttpException('用户未找到', HttpStatus.NOT_FOUND);
    }
  }

  @Delete(':id')
  @ApiDelete()
  async delete(@Param('id', ParseIntPipe) id: number) {
    const result = await this.userService.delete(id);
    if (result.affected) {
      return Result.success('删除成功');
    } else {
      throw new HttpException('用户未找到', HttpStatus.NOT_FOUND);
    }
  }
}

function ApiFindAll() {
  return applyDecorators(
    ApiOperation({ summary: '获取所有用户的列表' }),
    ApiResponse({
      status: 200,
      description: '返回用户列表',
      type: [User],
    }),
  );
}

function ApiFindOne() {
  return applyDecorators(
    ApiOperation({ summary: '根据ID单个用户的详情' }),
    ApiParam({ name: 'id', description: '用户ID', type: Number }),
    ApiResponse({
      status: 200,
      description: '返回用户详情',
      type: User,
    }),
    ApiResponse({
      status: 404,
      description: '用户未找到',
    }),
  );
}

function ApiCreate() {
  return applyDecorators(
    ApiOperation({ summary: '创建用户' }),
    ApiBody({ type: CreateUserDto }),
    ApiBearerAuth(),
    ApiResponse({
      status: 200,
      description: '创建成功',
      type: User,
    }),
    ApiResponse({
      status: 400,
      description: '创建失败',
    }),
  );
}

function ApiUpdate() {
  return applyDecorators(
    ApiOperation({ summary: '更新用户' }),
    ApiBody({ type: UpdateUserDto }),
    ApiResponse({
      status: 200,
      description: '更新成功',
      type: Result,
    }),
    ApiResponse({
      status: 400,
      description: '更新失败',
    }),
  );
}

function ApiDelete() {
  return applyDecorators(
    ApiOperation({ summary: '删除用户' }),
    ApiParam({ name: 'id', description: '用户ID', type: Number }),
    ApiResponse({
      status: 200,
      description: '删除成功',
      type: Result,
    }),
    ApiResponse({
      status: 400,
      description: '删除失败',
    }),
  );
}
