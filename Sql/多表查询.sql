# SQL92 语法实现外连接：使用+
select
    e.employee_id,
    d.department_name
from employees e, departments d
where
    e.department_id = d.department_id;

# 查询员工名为'Abel'的人在哪个城市工作
select *
from employees
where last_name = 'Abel';

select last_name, department_name, departments.department_id
from employees, departments
where
    employees.department_id = departments.department_id;

# 可以给表取别名，在select中和WHERE中使用表的别名
# 如果给表取了别名，一旦在select和WHERE中使用表名的话，则必须使用表的别名，而不能使用表的原名。
select
    emp.last_name,
    dept.department_name,
    dept.department_name
from
    employees emp,
    departments dept
where
    emp.department_id = dept.department_id;

# 练习：查询员工的employee_id,last_name,deparment_name, city
select
    e.employee_id,
    e.last_name,
    d.department_name,
    l.city
from
    employees e,
    departments d,
    locations l
where
    e.department_id = d.department_id
    and d.location_id = l.location_id;

# 等值连接VS非等值连接
# 非等值连接的例子
select
    e.last_name,
    e.salary,
    j.grade_level
from employees e, job_grades j
# where
#    e.salary between j.lowest_sal and j.highest_sal;
where 
    e.salary >= j.lowest_sal
    and e.salary <= j.highest_sal;

# 自连接 vs 非自连接
# 自连接
# 练习：查询员工id，员工姓名及其管理者的id和姓名
select
    emp.employee_id,
    emp.last_name,
    mgr.employee_id,
    mgr.last_name
from
    employees emp,
    employees mgr
where
    emp.manager_id = mgr.employee_id;

# 内连接 VS 外连接
# 内连接 合并具有同一列的两个以上的表的行，结果集中不包含一个表与另一个表不匹配的行
select
    employee_id,
    department_name
from employees e, departments d
where
    e.department_id = d.department_id;

# 外连接 左外连接 右外连接 满外连接
# 左外连接
# SQL99语法中使用join ... on的方法实现多表查询
# SQL99语法实现内连接
select
    employee_id,
    department_name
from employees e
    join departments d on e.department_id = d.department_id;

select e.employee_id, e.last_name, d.department_name, l.city
from
    employees e
    join departments d on e.department_id = d.department_id
    join locations l on d.location_id = l.location_id;

# SQL99 语法实现外连接
# 练习 查询所有员工的last_name, department_name信息
# 左外连接
select e.last_name, e.department_name
from employees e
    join departments d on e.department_id = d.department_id;

# 右外连接
select
    last_name,
    department_name
from employees e
    right join departments d on e.department_id = d.department_id;

# 满外接连 mysql不支持FULL OUTER join
select
    last_name,
    department_name
from employees e full outer
    join departments d on e.department_id = d.department_id;

# union 操作符 union all (重复的部分的不去重) 合并查询集
# SQL99自然连接
select
    employee_id,
    last_name,
    department_name
from employees e
    join departments d on e.department_id = d.department_id and e.manager_id = d.manager_id;

select
    employee_id,
    last_name,
    department_name
from employees e
    natural join departments d;

# SQL99 USING的使用
select
    last_name,
    department_name
from employees e
    join departments d on e.department_id = d.department_id;

select last_name, department_name
from employees e
    join departments d using (department_id);

# 练习1 显示所有员工的姓名、部门号和部门名称
select
    emp.last_name,
    dep.department_id,
    dep.department_name
from employees emp
    left join departments dep on emp.department_id = dep.department_id;

# 练习2 查询90号部门员工的job_id和 90号部门的localtion_id
select
    e.job_id,
    d.location_id
from employees e
    join departments d on e.department_id = d.department_id
where e.department_id = 90;

# 练习3 选择所有有奖金的员工的last_name, department_name, lacation_id, city
select
    e.last_name,
    d.department_name,
    l.location_id,
    l.city
from employees e
    left join departments d on e.department_id = d.department_id
    left join locations l on d.location_id = l.location_id
where
    e.commission_pct is not null;

# 练习4. 选择city在Toronto工作的员工的last_name, job_id, dempartment_id, department_name
select
    e.last_name,
    e.job_id,
    d.department_id,
    d.department_name
from employees e
    join departments d on e.department_id = d.department_id
    join locations l on d.location_id = l.location_id
where l.city = 'Toronto';

# 练习5 查询哪些部门没有员工
select d.department_id
from departments d
    left join employees e on d.department_id = e.department_id
where e.department_id is null;

# 子查询
select department_id
from departments d
where not exists (
        select *
        from employees e
        where
            e.department_id = d.department_id
    );

# 练习6 查询部门名为Sales或IT的员工信息
select
    e.employee_id,
    e.last_name,
    e.department_id
from employees e
    join departments d on e.department_id = d.department_id
where
    d.department_name in ('Sales', 'IT');

# 7种join的实现
# 1. 交集
select employee_id, department_name
from employees e
    join departments d on e.department_id = d.department_id;

# 2. 左外连接
select employee_id, department_name
from employees e
    left join departments d on e.department_id = d.department_id;

# 3. 右外连接
select employee_id, department_name
from employees e
    right join departments d on e.department_id = d.department_id;

# 4 左 - 右
select employee_id, department_name
from employees e
    left join departments d on e.department_id = d.department_id
    where d.department_id is null;

# 5 右 - 左
select employee_id, department_name
from employees e
    right join departments d on e.department_id = d.department_id
    where e.department_id is null;

# 6 满外连接
select employee_id, department_name
from employees e
left join departments d on e.department_id = d.department_id
union all
select employee_id, department_name
from employees e
    right join departments d on e.department_id = d.department_id
    where e.department_id is null;

# 左 + 右 不要交集
select employee_id, department_name
from employees e
left join departments d on e.department_id = d.department_id
where d.department_id is null
union all
select employee_id, department_name
from employees e
    right join departments d on e.department_id = d.department_id
    where e.department_id is null;