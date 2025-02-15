# 排序 # 如果没有使用排序操作，默认情况下查询返回的数据是按照添加数据的顺序显示的 select * from employees;

# 练习，按照salary从高到低的顺序显示员工信息
# 使用 order by 对查询到的数据进行排序操作
# 升序 asc 默认值
# 降序 desc
select
    employee_id,
    last_name,
    salary
from employees
order by salary desc;

# 可以使用列的别名，进行排序
# 列的别名只能在ORDER BY 中使用，不能在WHERE中使用
select
    employee_id,
    salary,
    salary * 12 annul_sal
from employees
order by annul_sal;

select
    employee_id,
    salary,
    department_id
from employees
where
    department_id in (50, 60, 70)
order by department_id desc;

# 二级排序 
# 练习 显示员工信息，按照department_id的降序排序，salary的升序排序
select
    employee_id,
    salary,
    department_id
from employees
where
    department_id in (50, 60, 70)
order by
    department_id desc,
    salary asc;

# 分页
# mysql 使用LIMIT实现数据的分页显示
select employee_id, last_name
from employees
limit 0, 20;

select
    employee_id,
    last_name,
    salary
from employees
where salary > 6000
order by salary desc
limit 10
offset 0;

# limit 0, 10;

# MySQL8.0新特性：LIMIT ... offset ... 
# 练习 选择工资不在8000到17000的员工的姓名和工资，按工资降序，显示第21到40位置的数据
select last_name, salary
from employees
where
    salary not BETWEEN 8000 and 17000
order by salary desc
limit 20, 20;

# 练习 查询邮箱中包含e的员工信息，并先按照邮箱字节数排序，再按发部门号升序
select
    employee_id,
    last_name,
    email,
    department_id
from employees
where email like '%e%'
order by
    length(email) desc,
    department_id;