/*
 * @Author: water.li
 * @Date: 2024-11-23 22:32:39
 * @Description:
 * @FilePath: \Notebook\Nest\application\src\shared\services\mysql-base.service.ts
 */
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';

@Injectable()
export abstract class MySQLBaseService<T> {
  // 一个User实体对应数据库里的一张表，也会对应一个UserRepository仓库
  constructor(protected repository: Repository<T>) {}
  async findAll() {
    return this.repository.find();
  }
}
