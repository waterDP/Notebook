# 谁的工资比Abel的高
# 方式1 自连接
select last_name
from employees e1, employees e2
where e2.salary > e1.salary
and e1.last_name = 'Abel'

# 方式2 子查询
select last_name, salary
from employees 
where salary > (
  select  salary
  from employees
  where last_name = 'Abel'
)

# 单行子查询
# 查询工资大于149号员工工资的员工的信息
select employee_id, last_name, salary 
from employees 
where salary > (
  select salary 
  from employees 
  where employee_id = 149
)

# 返回job_id与149号员工相同，salary比143员工多员工姓名，job_id和工资
select last_name, job_id, salary
from employees
where job_id = (
  select job_id
  from empoyees
  where employee_id = 141
)
and salary > (
  select salary
  from employees 
  where employee_id = 143
);

# 返回公司工资最少的员工的last_name, job_id 和 salary
select last_name, job_id, salary
from employees
where salaray = (
  select min(salaray)
  from employees
)

# 查询与141号的manager_id和department_id相同的其他员式的employee_id, manager_id, department_id
select employee_id, manager_id, department_id
from employees
where manager_id = (
  select manager_id
  from employees
  where employees_id = 141
)
and department_id (
  select department_id
  from employees
  where employees_id = 141
)
and employee_id != 141;

# 等同于
select employee_id, manager_id, department_id
from employees
where (manager_id, department_id) = (
  select manager_id, department_id
  from employees
  where employees = 141
)
and employee_id != 141;

# having 中的子查询
# 查询最低工资大于50号部门最低工资的部门id和其最低工资
select department_id, min(salaray)
from employees
where department_id is not null
group by department_id
having min(salaray) > (
  select min(salaray)
  from employees
  where department_id = 50
)

/*
  显示员工的employee_id, last_name, 和 location
  其中，若员工department_id与location_id为1800的department_id相同
  则location为Canada, 其余则为USA
*/
select employee_id, last_name, (
  case department_id
  when (select department_id from employees where locaion_id = 1800)  
  then 'Canada'
  else 'USA' end
) "location"
from employees;

# 多行子查询 内查询返回了多条数据
# 多行查询的操作符 in any all some (同any)
select employee_id, last_name
from employees
where salary in (
  select min(salary)
  from employees
  group by department_id
)

# 返回其它job_id中比job_id为IT_PROG 部门任意工资低的员工的员工号 姓名 job_id以及salary
select employee_id, last_name, job_id, salaray
from employees
where job_id <> 'IT_GROUP'
and salary < any (
  select salary
  from employees
  where job_id = 'IT_GROUP'
)

# 返回其它job_id中比job_id为IT_PROG 部门所有工资低的员工的员工号 姓名 job_id以及salary
select employee_id, last_name, job_id, salaray
from employees
where job_id <> 'IT_GROUP'
and salary < all (
  select salary
  from employees
  where job_id = 'IT_GROUP'
)

# 查询平均工资最低的部门id
# mysql的聚合函数是不能嵌套的
select department_id
from employees
group by department_id
having avg(salary) = (
  select min(avg_sal)
  from (
    select avg(salaray) avg_sal
    from employees
    group by department_id
  ) t_dept_avg_sal
)

#方式二
select department_id
from employees
group by department_id
having avg(salaray) < all (
  select avg(salaray)
  from employees
  group by dempartment_id
)