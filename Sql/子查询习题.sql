# 1. 查询和Zlotey相同部门的员工姓名和工资
select last_name, salaray
from employees 
where department_id = (
  select department_id
  from employees
  where last_name = 'Zlotey'
)

# 2. 查询工资比公司平均高的员工号，姓名和工资
select employee_id, last_name, salary
from employees
where salaray > (
  select avg(salary)
  from employees
)

# 3. 查询工资大于所有job_id = 'SA_MAN'的员工的工资的员工的last_name, job_id, salary
select last_name, job_id, salary
from employees
where salaray > all (
  select salary
  from employees
  where job_id = 'SA_MAN'
)

# 4. 查询和姓名中包含字母u的员工所在相同部门的员工的员工号和姓名
select employee_id, last_name
from employees
where department_id in (
  select distinct department_id
  from employees
  where last_name like '%u%'
)

# 5. 查询在部门的location_id为1700的部门工作的员工的员工号
select employee_id
from employees
where department_id = (
  select department_id
  from departments
  where location_id = 1700
)
