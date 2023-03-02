# 谁的工资比Abel的高
# 方式1 自连接
SELECT e1.last_name
FROM employees e1, employees e2
WHERE
    e1.salary > e2.salary
    AND e2.last_name = 'Abel';

# 方式2 子查询
SELECT last_name, salary
FROM employees
WHERE salary > (
        SELECT salary
        FROM employees
        WHERE
            last_name = 'Abel'
    );

# 单行子查询 内查询返回了一条数据
# 单行操作符 = != >= <= > <
# 查询工资大于149号员工工资的员工的信息
SELECT
    employee_id,
    last_name,
    salary
FROM employees
WHERE salary > (
        SELECT salary
        FROM employees
        WHERE
            employee_id = 149
    );

# 返回job_id与149号员工相同，salary比143员工多员工姓名，job_id和工资
SELECT
    last_name,
    job_id,
    salary
FROM employees
WHERE job_id = (
        SELECT job_id
        FROM employees
        WHERE
            employee_id = 149
    )
    AND salary > (
        SELECT salary
        FROM employees
        WHERE
            employee_id = 143
    );

# 返回公司工资最少的员工的last_name, job_id 和 salary
SELECT
    last_name,
    job_id,
    salary
FROM employees
WHERE salary = (
        SELECT MIN(salary)
        FROM employees
    );

# 查询与141号的manager_id和department_id相同的其他员式的employee_id, manager_id, department_id
SELECT
    employee_id,
    manager_id,
    department_id
FROM employees
WHERE manager_id = (
        SELECT manager_id
        FROM employees
        WHERE
            employee_id = 141
    )
    AND department_id = (
        SELECT department_id
        FROM employees
        WHERE
            employee_id = 141
    )
    AND employee_id != 141;

# 等同于
SELECT
    employee_id,
    manager_id,
    department_id
FROM employees
WHERE (department_id, manager_id) = (
        SELECT
            department_id,
            manager_id
        FROM employees
        WHERE
            employee_id = 141
    )
    AND employee_id <> 141;

# having 中的子查询
# 查询最低工资大于50号部门最低工资的部门id和其最低工资
SELECT
    department_id,
    MIN(salary)
FROM employees
WHERE
    department_id IS NOT NULL
GROUP BY department_id
HAVING MIN(salary) > (
        SELECT MIN(salary)
        FROM employees
        WHERE
            department_id = 50
    );

/*
 题目 显示员工的dempartment_id, last_name 和 location
 其中，若员工的department_id与location_id为1800的department_id相同
 则location为Canada，其余则为USA
 */

SELECT
    employee_id,
    last_name,
    CASE department_id
        WHEN (
            SELECT
                department_id
            FROM locations
            WHERE
                location_id = 1800
        ) THEN 'Canada'
        ELSE 'USA'
    END "location"
FROM employees;

# 多行子查询 内查询返回了多条数据
/* 
 多行查询的操作符 
 IN 等于列表中的任意一个
 ANY 需要和单行操作符一起使用，和子查询返回的某一个值比较
 ALL 需要和单行操作符一起使用，和子查询返回的所有值比较
 SOME(同ANY)
 */
# 题目 返回其它job_id中比job_id为IT_PROG 部门任意工资低的员工的员工号 姓名 job_id以及salary
SELECT
    last_name,
    job_id,
    salary
FROM employees
WHERE
    job_id <> 'IT_PROG'
    AND salary < ALL (
        SELECT salary
        FROM employees
        WHERE
            job_id = 'IT_PROG'
    );

# 查询平均工资最低的部门id
# mysql的聚合函数是不能嵌套的
SELECT department_id
FROM employees
GROUP BY department_id
HAVING AVG(salary) = (
        SELECT
            MIN(avg_salary)
        FROM (
                SELECT
                    AVG(salary) avg_salary
                FROM
                    employees
                GROUP BY
                    department_id
            ) t_dept_avg_sal
    );

#方式二
SELECT department_id
FROM employees
GROUP BY department_id
HAVING AVG(salary) <= ALL (
        SELECT AVG(salary)
        FROM employees
        GROUP BY
            department_id
    );

# 相关子查询
# 案例 查询员工中工资大于本部门平均工资的员工的last_name, salary和其department_id
# 方式一 相关子查询
SELECT
    last_name,
    salary,
    department_id
FROM employees `outer`
WHERE salary > (
        SELECT AVG(salary)
        FROM employees
        WHERE
            department_id = `outer`.department_id
    );

#方式二 在from声明子查询
SELECT
    e.last_name,
    e.salary,
    e.department_id
FROM employees e, (
        SELECT
            department_id,
            AVG(salary) avg_sal
        FROM employees
        GROUP BY
            department_id
    ) t_dept_avg_sal
WHERE
    e.department_id = t_dept_avg_sal.department_id
    AND e.salaray > t_dept_avg_sal.avg_sal;

# 题目：查询员工的id, salary, 按照department_name 排序
SELECT department_id, salary
FROM employees e
ORDER BY (
        SELECT
            department_name
        FROM departments d
        WHERE
            e.department_id = d.department_id
    ) ASC;

# 题目 若employees表中employee_id与job_history表中employee_id相同的数目不小于2
# 输出这些相同id的员工的employee_id, last_name和其job_id
SELECT
    employee_id,
    last_name,
    job_id
FROM employees e
WHERE 2 <= (
        SELECT count(*)
        FROM job_history
        WHERE
            e.employee_id = j.employee_id
    );

# exists 与 not exists 关键字
# 题目 查询公司管理者的emplyee_id, last_id, job_id, department_id
# 方式1: 自连接
SELECT
    DISTINCT mgr.employee_id,
    mgr.last_name,
    mgr.job_id,
    mgr.department_id
FROM employees emp
    JOIN employees mgr ON emp.manager_id = mgr.employee_id;

#方式2：子查询
SELECT
    employee_id,
    last_name,
    job_id,
    department_id
FROM employees
WHERE employee_id IN (
        SELECT
            DISTINCT manager_id
        FROM employees
    );

#方式3  使用exists
SELECT
    employee_id,
    last_name,
    job_id,
    department_id
FROM employees e1
WHERE EXISTS (
        SELECT *
        FROM employees e2
        WHERE
            e1.employee_id = e2.manager_id
    );

# 题目：查询departments表中，不存在于employees表中的部门的department_id和department_name
# 方式1 
SELECT
    d.department_id,
    d.department_name
FROM employees e
    RIGHT JOIN departments d ON e.department_id = d.department_id
WHERE e.department_id IS NULL;

#方式2
SELECT
    department_id,
    department_name
FROM departments d
WHERE NOT EXISTS (
        SELECT *
        FROM employees e
        WHERE
            e.department_id = d.department_id
    );

# 习题
# 1. 查询和Zlotey相同部门的员工姓名和工资
SELECT last_name, salary
FROM employees
WHERE department_id = (
        SELECT department_id
        FROM employees
        WHERE
            last_name = 'Zlotkey'
    );

# 2. 查询工资比公司平均高的员工号，姓名和工资
SELECT
    employee_id,
    last_name,
    salary
FROM employees
WHERE salary > (
        SELECT AVG(salary)
        FROM employees
    );

# 3. 查询工资大于所有job_id = 'SA_MAN'的员工的工资的员工的last_name, job_id, salary
SELECT
    last_name,
    job_id,
    salary
FROM employees
WHERE salary > ALL (
        SELECT salary
        FROM employees
        WHERE
            job_id = 'SA_MAN'
    );

# 4. 查询和姓名中包含字母u的员工所在相同部门的员工的员工号和姓名
SELECT employee_id, last_name
FROM employees
WHERE department_id IN (
        SELECT department_id
        FROM employees
        WHERE
            last_name LIKE '%u%'
    );

# 5. 查询在部门的location_id为1700的部门工作的员工的员工号
SELECT
    employee_id,
    department_id
FROM employees
WHERE department_id IN (
        SELECT department_id
        FROM departments
        WHERE
            location_id = 1700
    );

# 题目：查询员工的id, salary 按照department_name排序
SELECT employee_id, salary
FROM employees e
ORDER BY (
        SELECT
            department_name
        FROM departments d
        WHERE
            e.department_id = d.department_id
    ) ASC;

/* 
 题目 若employees表中employee_id与job_history表中employee_id相同的数目不小于2 
 输出这些相同的id的员工的employee_id, last_name和其job_id
 */

SELECT
    employee_id,
    last_name,
    job_id
FROM employees e
WHERE 2 <= (
        SELECT COUNT(*)
        FROM job_history j
        WHERE
            e.employee_id = j.employee_id
    );

# EXISTS 存在的
/*
 题目 查询公司管理者的employee_id, last_name, job_id, department_id信息
 */
# 方式1 自接连
SELECT
    DISTINCT mgr.employee_id,
    mgr.last_name,
    mgr.job_id,
    mgr.department_id
FROM employees emp
    JOIN employees mgr ON emp.manager_ id = mgr.employee_id;

# 方式2 子查询
SELECT
    employee_id,
    last_name,
    job_id,
    department_id
FROM employees
WHERE employee_id IN (
        SELECT
            DISTINCT manager_id
        FROM employees
    );

# 方式3 他用EXISTS
SELECT
    employee_id,
    last_name,
    job_id,
    department_id
FROM employees e1
WHERE EXISTS (
        SELECT *
        FROM employees e2
        WHERE
            e1.employee_id = e2.manager_id
    );

/*
 题目 查询departments表中，不存在于employees表中的部门的department_id和department_name
 */

# 方式一
SELECT
    d.department_id,
    d.department_name
FROM employees e
    RIGHT JOIN departments d ON e.department_id = d.department_id
WHERE e.department_id IS NULL;

# 方式二 NOT EXISTS
SELECT
    department_id,
    department_name
FROM departments d
WHERE NOT EXISTS (
        SELECT *
        FROM employees e
        WHERE
            d.department_id = e.department_id
    );

# 题目 查询员工中工资大于本部门平均工资的员工的last_name, salary 和其department_id
# 方式一 相关子查询
SELECT
    last_name,
    salary,
    department_id
FROM employees e1
WHERE salary > (
        SELECT AVG(salary)
        FROM employees e2
        WHERE
            e1.department_id = e2.department_id
    );

# 方式2：在FROM中声明子查询
SELECT
    el.last_name,
    el.salary,
    el.department_id
FROM employees el, (
        SELECT
            department_id,
            AVG(salary) avg_sal
        FROM employees
        GROUP BY
            department_id
    ) t_emp_avg_sal
WHERE
    el.department_id = t_emp_avg_sal.department_id
    AND el.salary > t_emp_avg_sal.avg_sal;