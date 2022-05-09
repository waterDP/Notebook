# SQL92 语法实现外连接：使用+
select employee_id, department_name
from employees e, departments d
where e.department_id = d.department_id(+);

# SQL99语法实现内连接
select last_name, department_name
from employees e INNER join departments d
on e.department_id = d.department_id;

select last_name, department_name, city
from employees e join departments d 
on e.department_id = d.department_id
join locations l
on d.location_id = l.location_id

# SQL99语法中使用JOIN...ON的方式实现多表的查询。这种方式也能外连接问题
# 左外连接
select last_name, department_name
from employees e left join departments d
on e.department_id = d.department_id;

#右外连接
select last_name, department_name
from employees e right join departments d
on e.department_id = d.department_id;

# union 和 union all 的使用
# union 会进行去重操作
# union all 不进行去重操作

# 自然连接
# 它会帮你自动查询两张连接表中所有相同的字段 然后进行等值连接
select employee_id, last_name, department_name
from empoyees e natural join departments d;

# USING
select emplyee_id, last_name, department_name
from employees e join departments d
using (department_id)

# 选择city在Toronto工作的员工的last_name, job_id, department_id, department_name
select e.last_name, e.job_id, d.department_id, d.department_name
from employees e join departments
on e.department_id = d.department_id
join locations l
on d.location_id = l.location_id
where l.city = 'Toronto';

# 查询哪些部门没有员工
select d.department_id
from departments d left join employees e
using (department_id)
where e.department_id is null;

# 子查询实现
select department_id
from departments d
where not exists (
  select *
  from employees e
  where e.department_id = d.department_id
);
