# 创建视图
# 单表
create view vu_empl as
select
    employee_id,
    last_name,
    salary
from emps;

create view VU_EMP2(EMP_ID, `NAME`, MONTHLY_SAL) as 
	select employee_id, last_name, salary from emp3 where salary > 
8000; 

create view VU_EMP_SAL as 
	select
	    department_id,
	    avg(salary) avg_sal
	from emps
	where
	    department_id is not null
	group by department_id # 多表
	create view vu_emp_dept as
	select
	    e.employees_id,
	    e.department_id,
	    d.department_name
	from emps e
	    join depts d on e.department_id = d.department_id # 基于视图来创建视图
	create view vu_emp4 as
	select
	    employees_id,
	    last_name
	from
VU_EMP1; 

# 查看视图 # 1. 查看数据库的表对象，视图对象 show tables;

# 2. 查看视图的结构
desc viewname # 3. 查看视图的属性信息
show table status
    like 'vu_empl' # 4. 查看视图的详细定义信息
show create view vu_empl;

select * from vu_empl;

select
    employee_id,
    last_name,
    salary
from
    emps # 更新视图中的数据，会导致基表中数据改变
update view vu_emp1
set salary = 2000
where employee_id = 101;

# 修改表
# 修改表中的数据，会导致视图中的数据改变
update emps
set salary = 1000
where employee_id = 101;

# 修改视图
# 方式一
create
or
replace view vu_empl as
select
    employee_id,
    last_name,
    salary,
    email
from emps
where salary > 7000;

#方式二
alter view vu_emp1 as
select
    employee_id,
    last_name,
    salary,
    email,
    hire_date
from emps;

# 删除视图 drop view vu_emp4;

drop view if exists vu_emp3, vu_emp3;