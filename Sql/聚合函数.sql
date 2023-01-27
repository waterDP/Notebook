# avg() 求平均
# sum() 求合
# max() 求最大
# min() 求最小
# count() 求数量

# having 分组的过滤条件
# 要求1 如果过滤条件中使用了聚合函数，则必须使用 having 来替换 where。否则，报错
# 要求2 having 必须声明在 group by 的后面
# 要求3 开发中我们使用HAVING的前提是SQL中使用了 group by 的后面

# 练习：查询部门id为10, 20, 30, 40这4个部门中最高工资比1000高的部门信息
# 方式二 推荐，执行效率高于方式二
select department_id, max(salary)
from employees 
where department_id in (10, 20, 30, 40)
group by department_id

# 方式二
select department_id, max(salary)
from employees
group by department_id
having max(salary) > 1000 and department_id in (10, 20, 30, 40)

#结论：当过滤条件中有聚合函数时，则此过滤必须声明在 having 中
      当裘皮条件中没有聚合函数时，则此过滤条件声明在 where 或 having 中都可以，但是，建议声明在where中

# SQL 的原理
# select语句的编写顺序
select ... from ... where ... group by ... having ... order by ... limit ...

# select语句的执行顺序
from (-> on -> left join / right join) -> where -> group by -> having -> select -> distinct -> order by -> limit 




