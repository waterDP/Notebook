# 谁的工资比Abel的高
# 方式1 自连接
select e1.last_name
from employees e1, employees e2
where
    e1.salary > e2.salary
    and e2.last_name = 'Abel';

# 方式2 子查询
select last_name, salary
from employees
where salary > (
        select salary
        from employees
        where
            last_name = 'Abel'
    );

# 单行子查询 内查询返回了一条数据
# 单行操作符 = != >= <= > <
# 查询工资大于149号员工工资的员工的信息
select
    employee_id,
    last_name,
    salary
from employees
where salary > (
        select salary
        from employees
        where
            employee_id = 149
    );

# 返回job_id与149号员工相同，salary比143员工多员工姓名，job_id和工资
select
    last_name,
    job_id,
    salary
from employees
where job_id = (
        select job_id
        from employees
        where
            employee_id = 149
    )
    and salary > (
        select salary
        from employees
        where
            employee_id = 143
    );

# 返回公司工资最少的员工的last_name, job_id 和 salary
select
    last_name,
    job_id,
    salary
from employees
where salary = (
        select min(salary)
        from employees
    );

# 查询与141号的manager_id和department_id相同的其他员式的employee_id, manager_id, department_id
select
    employee_id,
    manager_id,
    department_id
from employees
where manager_id = (
        select manager_id
        from employees
        where
            employee_id = 141
    )
    and department_id = (
        select department_id
        from employees
        where
            employee_id = 141
    )
    and employee_id != 141;

# 等同于
select
    employee_id,
    manager_id,
    department_id
from employees
where (department_id, manager_id) = (
        select
            department_id,
            manager_id
        from employees
        where
            employee_id = 141
    )
    and employee_id <> 141;

# having 中的子查询
# 查询最低工资大于50号部门最低工资的部门id和其最低工资
select
    department_id,
    min(salary)
from employees
where
    department_id is not null
group by department_id
having min(salary) > (
        select min(salary)
        from employees
        where
            department_id = 50
    );

/*
 题目 显示员工的dempartment_id, last_name 和 location
 其中，若员工的department_id与location_id为1800的department_id相同
 则location为Canada，其余则为USA
 */

select
    employee_id,
    last_name,
    CASE department_id
        when (
            select
                department_id
            from locations
            where
                location_id = 1800
        ) then 'Canada'
        else 'USA'
    end "location"
from employees;

# 多行子查询 内查询返回了多条数据
/* 
 多行查询的操作符 
 in 等于列表中的任意一个
 ANY 需要和单行操作符一起使用，和子查询返回的某一个值比较
 ALL 需要和单行操作符一起使用，和子查询返回的所有值比较
 SOME(同ANY)
 */
# 题目 返回其它job_id中比job_id为IT_PROG 部门任意工资低的员工的员工号 姓名 job_id以及salary
select
    last_name,
    job_id,
    salary
from employees
where
    job_id <> 'IT_PROG'
    and salary < ALL (
        select salary
        from employees
        where
            job_id = 'IT_PROG'
    );

# 查询平均工资最低的部门id
# mysql的聚合函数是不能嵌套的
select department_id
from employees
group by department_id
having AVG(salary) = (
        select
            min(avg_salary)
        from (
                select
                    AVG(salary) avg_salary
                from
                    employees
                group by
                    department_id
            ) t_dept_avg_sal
    );

#方式二
select department_id
from employees
group by department_id
having AVG(salary) <= ALL (
        select AVG(salary)
        from employees
        group by
            department_id
    );

# 相关子查询
# 案例 查询员工中工资大于本部门平均工资的员工的last_name, salary和其department_id
# 方式一 相关子查询
select
    last_name,
    salary,
    department_id
from employees `outer`
where salary > (
        select AVG(salary)
        from employees
        where
            department_id = `outer`.department_id
    );

#方式二 在from声明子查询
select
    e.last_name,
    e.salary,
    e.department_id
from employees e, (
        select
            department_id,
            AVG(salary) avg_sal
        from employees
        group by
            department_id
    ) t_dept_avg_sal
where
    e.department_id = t_dept_avg_sal.department_id
    and e.salaray > t_dept_avg_sal.avg_sal;

# 题目：查询员工的id, salary, 按照department_name 排序
select department_id, salary
from employees e
order by (
        select
            department_name
        from departments d
        where
            e.department_id = d.department_id
    ) asc;

# 题目 若employees表中employee_id与job_history表中employee_id相同的数目不小于2
# 输出这些相同id的员工的employee_id, last_name和其job_id
select
    employee_id,
    last_name,
    job_id
from employees e
where 2 <= (
        select count(*)
        from job_history
        where
            e.employee_id = j.employee_id
    );

# exists 与 not exists 关键字
# 题目 查询公司管理者的emplyee_id, last_id, job_id, department_id
# 方式1: 自连接
select
    DISTINCT mgr.employee_id,
    mgr.last_name,
    mgr.job_id,
    mgr.department_id
from employees emp
    join employees mgr on emp.manager_id = mgr.employee_id;

#方式2：子查询
select
    employee_id,
    last_name,
    job_id,
    department_id
from employees
where employee_id in (
        select
            DISTINCT manager_id
        from employees
    );

#方式3  使用exists
select
    employee_id,
    last_name,
    job_id,
    department_id
from employees e1
where EXISTS (
        select *
        from employees e2
        where
            e1.employee_id = e2.manager_id
    );

# 题目：查询departments表中，不存在于employees表中的部门的department_id和department_name
# 方式1 
select
    d.department_id,
    d.department_name
from employees e
    RIGHT join departments d on e.department_id = d.department_id
where e.department_id is null;

#方式2
select
    department_id,
    department_name
from departments d
where not EXISTS (
        select *
        from employees e
        where
            e.department_id = d.department_id
    );

# 习题
# 1. 查询和Zlotey相同部门的员工姓名和工资
select last_name, salary
from employees
where department_id = (
        select department_id
        from employees
        where
            last_name = 'Zlotkey'
    );

# 2. 查询工资比公司平均高的员工号，姓名和工资
select
    employee_id,
    last_name,
    salary
from employees
where salary > (
        select AVG(salary)
        from employees
    );

# 3. 查询工资大于所有job_id = 'SA_MAN'的员工的工资的员工的last_name, job_id, salary
select
    last_name,
    job_id,
    salary
from employees
where salary > ALL (
        select salary
        from employees
        where
            job_id = 'SA_MAN'
    );

# 4. 查询和姓名中包含字母u的员工所在相同部门的员工的员工号和姓名
select employee_id, last_name
from employees
where department_id in (
        select department_id
        from employees
        where
            last_name like '%u%'
    );

# 5. 查询在部门的location_id为1700的部门工作的员工的员工号
select
    employee_id,
    department_id
from employees
where department_id in (
        select department_id
        from departments
        where
            location_id = 1700
    );

# 题目：查询员工的id, salary 按照department_name排序
select employee_id, salary
from employees e
order by (
        select
            department_name
        from departments d
        where
            e.department_id = d.department_id
    ) asc;

/* 
 题目 若employees表中employee_id与job_history表中employee_id相同的数目不小于2 
 输出这些相同的id的员工的employee_id, last_name和其job_id
 */

select
    employee_id,
    last_name,
    job_id
from employees e
where 2 <= (
        select count(*)
        from job_history j
        where
            e.employee_id = j.employee_id
    );

# EXISTS 存在的
/*
 题目 查询公司管理者的employee_id, last_name, job_id, department_id信息
 */
# 方式1 自接连
select
    DISTINCT mgr.employee_id,
    mgr.last_name,
    mgr.job_id,
    mgr.department_id
from employees emp
    join employees mgr on emp.manager_ id = mgr.employee_id;

# 方式2 子查询
select
    employee_id,
    last_name,
    job_id,
    department_id
from employees
where employee_id in (
        select
            DISTINCT manager_id
        from employees
    );

# 方式3 他用EXISTS
select
    employee_id,
    last_name,
    job_id,
    department_id
from employees e1
where EXISTS (
        select *
        from employees e2
        where
            e1.employee_id = e2.manager_id
    );

/*
 题目 查询departments表中，不存在于employees表中的部门的department_id和department_name
 */

# 方式一
select
    d.department_id,
    d.department_name
from employees e
    RIGHT join departments d on e.department_id = d.department_id
where e.department_id is null;

# 方式二 not EXISTS
select
    department_id,
    department_name
from departments d
where not EXISTS (
        select *
        from employees e
        where
            d.department_id = e.department_id
    );

# 题目 查询员工中工资大于本部门平均工资的员工的last_name, salary 和其department_id
# 方式一 相关子查询
select
    last_name,
    salary,
    department_id
from employees e1
where salary > (
        select AVG(salary)
        from employees e2
        where
            e1.department_id = e2.department_id
    );

# 方式2：在from中声明子查询
select
    el.last_name,
    el.salary,
    el.department_id
from employees el, (
        select
            department_id,
            AVG(salary) avg_sal
        from employees
        group by
            department_id
    ) t_emp_avg_sal
where
    el.department_id = t_emp_avg_sal.department_id
    and el.salary > t_emp_avg_sal.avg_sal;