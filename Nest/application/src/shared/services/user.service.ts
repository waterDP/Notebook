/*
 * @Author: water.li
 * @Date: 2024-11-23 22:32:39
 * @Description:
 * @FilePath: \Notebook\Nest\application\src\shared\services\user.service.ts
 */
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { User } from '../entities/user.entities';
import { Like, Repository } from 'typeorm';
import { MySQLBaseService } from './mysql-base.service';

@Injectable()
export class UserService extends MySQLBaseService<User> {
  // 一个User实体对应数据库里的一张表，也会对应一个UserRepository仓库
  constructor(@InjectRepository(User) protected repository: Repository<User>) {
    super(repository);
  }
  async findAll(keyword?: string) {
    const where = keyword
      ? [{ username: Like(`%${keyword}%`) }, { email: Like(`%${keyword}%`) }]
      : {};
    return this.repository.find({
      where,
    });
  }
}
