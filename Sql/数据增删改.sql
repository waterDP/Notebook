# 添加数据
# 方式一 一条一条的加入数据
# 1 没有指明添加的字段
insert into emp1
values(1, 'tom', '2000-12-20', 3400) # 注意，一定要按照声明的字段的先后顺序添加

# 2 指明要添加的字段
insert into emp1(id, hire, salary, `name`)
values(2, '1999-12-1', 4000, 'jerry')

insert into emp1(id, `name`, salary)
values
(3, 'jim', 5000),
(4, 'kimg', 23000);

# 方式二 将查询结果插入到表中
insert into emp1(id, `name`, salary, hire_date)
select employee_id, last_name, salary, hire_date
from dempartment_id in (50, 60)

# 更新数据
# update ... set ... where ...

update emp1
set hire_date = curdate()
where id = 5

update emp1
set hire_date = curdate(), salary = 6000
where id = 4

# 3. 删除数据 delete from ... where ...
delete from emp1
where id = 1

# 小结 DML操作默认情况下，执行完成以后都会自动提交数据
# 如果希望执行完成以后不自动提交数据，则需要使用 set autocommit = FALSE

# mysql8 新特性 计算列
create table test1(
  a int,
  b int,
  c int generated always as (a + b) virtual
)

insert into test1(a, b)
values(10, 20)

select * from test1

update test1
set a = 100

