/*
 * @Author: water.li
 * @Date: 2024-12-01 19:28:38
 * @Description:
 * @FilePath: \Notebook\Nest\application\src\shared\dtos\user.dto.ts
 */

import { ApiProperty, PartialType } from '@nestjs/swagger';
import {
  EmailValidators,
  IsSuperValidators,
  IsUsernameUnique,
  MobileValidators,
  PasswordValidators,
  SortValaidators,
  StartsWith,
  StatusValidators,
} from '../validators/user-validator';
import { IsNumber, IsOptional } from 'class-validator';

export class CreateUserDto {
  @StartsWith('user_')
  @IsUsernameUnique()
  @ApiProperty({ description: '用户名', example: 'user_1' })
  username: string;

  @PasswordValidators()
  @ApiProperty({ description: '密码', example: '123456' })
  password: string;

  @MobileValidators()
  @ApiProperty({ description: '手机号', example: '13800138000' })
  mobile: string;

  @EmailValidators()
  @ApiProperty({ description: '邮箱', example: 'jdbeu@qq.com' })
  email: string;

  @StatusValidators()
  @ApiProperty({ description: '状态', example: 1 })
  status: number;

  @IsSuperValidators()
  @ApiProperty({ description: '是否为超级管理员', example: true })
  is_super: boolean;

  @SortValaidators()
  @ApiProperty({ description: '排序编号', example: 100 })
  sort: number;
}

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @ApiProperty({ description: '用户id', example: 1 })
  @IsOptional()
  @IsNumber()
  id: number;
}
