/*
 * @Author: water.li
 * @Date: 2024-11-23 22:13:53
 * @Description:
 * @FilePath: \Notebook\Nest\application\src\shared\entities\user.entities.ts
 */

import {
  ApiHideProperty,
  ApiProperty,
  ApiPropertyOptional,
} from '@nestjs/swagger';
import { Exclude, Expose, Transform } from 'class-transformer';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

// 实体会映射为数据库的一张表
@Entity({ name: 'users' }) // 表名
export class User {
  @PrimaryGeneratedColumn() // 自增主键列
  @ApiProperty({ description: '用户id', example: 1 })
  id: number;

  @Column({ length: 50, unique: true })
  @ApiProperty({ description: '用户名', example: 'user_1' })
  username: string;

  @Column()
  @Exclude() // 添加exclude装饰器，在序列化时排除该字段
  @ApiHideProperty() // 表示这是一个隐藏字段，不会出现在Swagger文档中
  password: string;

  @Column({ length: 15, nullable: true })
  @Transform(({ value }) =>
    value ? value.replace(/(\d{3})(\d{4})(\d{4})/, '$1****$3') : value,
  )
  @ApiProperty({ description: '手机号', example: '13800138000' })
  mobile: string;

  @Column({ length: 100, nullable: true })
  @ApiProperty({ description: '邮箱', example: '134@qq.com' })
  email: string;

  @Expose()
  @ApiProperty({ description: '联系方式', example: '邮箱:123@qq.com' })
  get contact(): string {
    return `邮箱:${this.email}`;
  }

  @Column({ default: 1 }) // 是否生效 1 有效 0 无效
  @ApiProperty({ description: '状态', example: 1 })
  @ApiPropertyOptional()
  status: number;

  @Column({ default: false }) // 是否为超级管理员
  @ApiProperty({ description: '是否为超级管理员', example: true })
  is_super: boolean;

  @Column({ default: 100 }) // 排序编号
  @ApiProperty({ description: '排序编号', example: 100 })
  sort: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  @ApiProperty({ description: '创建时间', example: '2024-11-23 22:13:53' })
  createdAt: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  @ApiProperty({ description: '更新时间', example: '2024-11-23 22:13:53' })
  updatedAt: Date;
}
