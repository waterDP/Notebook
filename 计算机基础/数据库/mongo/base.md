# MONGO DB

## mongo 连接

## use [name] 切换数据库

## db.[collections].find() 显示集合中的所有记录

## db.[collections].insert({...}) 插入记录到集合

## 管道 db.[collections].aggregate([{}, {}])

- $project 查询指定的字段
- $match 用于过滤文档。用法类似于find中的参数
- $gte 大于等于
- $group 数据分组
- $sum 求合
- $sort 排序
- $limit 数量限制
- $skip 跳过几条数据
- $lookup 关联查询

db.[collections].aggregate([
  {
    $lookup: {
      from: 'order_item',
      localField: 'order_id',
      foreignField: 'order_id',
      as: 'items'
    }
  }
])

