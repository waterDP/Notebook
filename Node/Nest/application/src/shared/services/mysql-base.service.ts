/*
 * @Author: water.li
 * @Date: 2024-11-23 22:32:39
 * @Description:
 * @FilePath: \Notebook\Nest\application\src\shared\services\mysql-base.service.ts
 */
import { Injectable } from '@nestjs/common';
import { DeepPartial, FindOneOptions, Repository } from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

@Injectable()
export abstract class MySQLBaseService<T> {
  // 一个User实体对应数据库里的一张表，也会对应一个UserRepository仓库
  constructor(protected repository: Repository<T>) {}
  async findAll() {
    return this.repository.find();
  }
  async findOne(options: FindOneOptions<T>) {
    return this.repository.findOne(options)
  }

  async create(createDto: DeepPartial<T>) {
    const entity = await this.repository.save(createDto)
    return entity
  }
  async update(id: number, updateDto: QueryDeepPartialEntity<T>) {
    return this.repository.update(id, updateDto)
  }
  async delete(id: number) {
    return this.repository.delete(id)
  }
}
