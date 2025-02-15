# avg() 求平均
# sum() 求合
# max() 求最大 适用于数值类型，字符串类型，日期时间类型的字段（或变量）
# min() 求最小
# count() 求数量
# having 分组的过滤条件
# 要求1 如果过滤条件中使用了聚合函数，则必须使用 having 来替换 where。否则，报错
# 要求2 having 必须声明在 group by 的后面
# 要求3 开发中我们使用HAVING的前提是SQL中使用了 group by 的后面
# 练习：查询部门id为10, 20, 30, 40这4个部门中最高工资比1000高的部门信息
# 方式二 推荐，执行效率高于方式二
select
    department_id,
    max(salary)
from employees
where
    department_id in (10, 20, 30, 40)
group by department_id;

select
    max(last_name),
    min(last_name),
    max(hire_date),
    min(hire_date)
from employees;

# 方式二
select
    department_id,
    max(salary)
from employees
group by department_id
having
    max(salary) > 1000
    and department_id in (10, 20, 30, 40);

# 需求：查询公司的平均资金率;

# 错误的;

select AVG(commission_pct) from employees;

# 正确的;

select
    SUM(commission_pct) / count(IFNULL(commission_pct, 0))
from employees;

# GROUP BY的使用;

# 需求：查询各个部门的平均工资，最高工资
select
    department_id,
    AVG(salary)
from employees
group by department_id;

# 需求：查询各个department_id, job_id的平均工资
select
    department_id,
    job_id,
    AVG(salary)
from employees
group by
    department_id,
    job_id;

# 或
select
    department_id,
    job_id,
    AVG(salary)
from employees
group by
    job_id,
    department_id;

# 结论一： select 中出现的非组函数的字段必须声明在GROUP BY中！
#         反之，GROUP BY中声明的字段可以不出现在select中 
# 结论二： GROUP BY声明在from后面 WHERE后面 ORDER BY前面 LIMIT前面
# 结论三：MySQL中GROUP BY 使用WITH ROLLUP
# 说明 当使用WITH ROLLUP时，不能同时使用ORDER BY 排序，即WITH ROLLUP 与ORDER BY 是互斥的
select
    department_id,
    AVG(salary)
from employees
group by department_id
WITH ROLLUP;

# having 使用是过滤数据
# 练习 查询各个部门中最高工资比10000高的部门信息
select
    department_id,
    max(salary)
from employees
where max(salary) > 10000
group by department_id;

# 正确的
select
    department_id,
    max(salary)
from employees
group by department_id
having max(salary) > 1000;

# 练习 查询部门id为10, 20, 30, 40这4个部门中最高工资比10000高的部门信息
# 方式1: 推荐，执行效率高于方式2
select
    department_id,
    max(salary)
from employees
where
    department_id in (10, 20, 30, 40)
group by department_id
having max(salary) > 10000;

#方式2：
select
    department_id,
    max(salary)
from employees
group by department_id
having
    max(salary) > 10000
    and department_id in (10, 20, 30, 40);

#结论：当过滤条件中有聚合函数时，则此过滤必须声明在 HAVING中
#     当条件中没有聚合函数时，则此过滤条件声明在 where 或 having 中都可以，
#     但是，建议声明在WHERE中
# having 必须声明在GROUP BY的后面
# SQL 的原理
# select语句的编写顺序
select...from... (LEFT | RIGHT)
    join on...where...group by...having...limit...;

# select语句的执行顺序
from (-> on ->
    LEFT join /
    RIGHT join) ->
where ->
group by ->
having ->
select -> DISTINCT ->
order by ->
limit;

# 习题：查询各job_id的员工的工资的最大工资，最小值，平均值，总和
select
    job_id,
    max(salary) max_salary,
    min(salary) min_salary,
    AVG(salary) avg_salary,
    SUM(salary) sum_salary
from employees
group by job_id;

# 习题2：查询各个job_id的员工人数
select job_id, count(*)
from employees
group by job_id;

# 习题3：查询各个管理都手下员工的最低工资，其中最低工资不能低于6000，没有管理者的员工不计算在内ADD
select
    manager_id,
    min(salary)
from employees
where manager_id is not null
group by manager_id
having min(salary) > 6000;

# 习题4：查询每个工种，每个部门的部门名，工程名和最低工资
select
    d.department_name,
    e.job_id,
    min(salary)
from departments d
    LEFT join employees e on d.department_id = e.department_id
group by department_name, job_id;