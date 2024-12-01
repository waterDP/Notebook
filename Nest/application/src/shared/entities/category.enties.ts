import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  Tree,
  TreeChildren,
  TreeParent,
} from 'typeorm';

/**
 * adjacency-list 邻接表
 * closure-table 闭包表
 * materialized-path 物化路径
 * nested-set 嵌套集
 */
@Entity()
@Tree('adjacency-list')
export class Category {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  name: string;
  @TreeChildren()
  children: Category[];
  @TreeParent()
  parent: Category;
}
