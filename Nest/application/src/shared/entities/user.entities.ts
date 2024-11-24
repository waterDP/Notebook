/*
 * @Author: water.li
 * @Date: 2024-11-23 22:13:53
 * @Description:
 * @FilePath: \Notebook\Nest\application\src\shared\entities\user.entities.ts
 */

import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

// 实体会映射为数据库的一张表
@Entity()
export class User {
  @PrimaryGeneratedColumn() // 自增主键列
  id: number;
  @Column({ length: 50, unique: true })
  username: string;
  @Column()
  password: string;
  @Column({ length: 15, nullable: true })
  mobile: string;
  @Column({ length: 100, nullable: true })
  email: string;
  @Column({ default: 1 }) // 是否生效 1 有效 0 无效 
  status: number;
  @Column({ default: false }) // 是否为超级管理员 
  is_super: boolean;
  @Column({ default: 100 }) // 排序编号
  sort: number;
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createAt: Date;
  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updateAt: Date;
}
