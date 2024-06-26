# SQL92 语法实现外连接：使用+
SELECT
    e.employee_id,
    d.department_name
FROM employees e, departments d
WHERE
    e.department_id = d.department_id;

# 查询员工名为'Abel'的人在哪个城市工作
SELECT *
FROM employees
WHERE last_name = 'Abel';

SELECT
    last_name,
    department_name,
    departments.department_id
FROM employees, departments
WHERE
    employees.department_id = departments.department_id;

# 可以给表取别名，在SELECT中和WHERE中使用表的别名
# 如果给表取了别名，一旦在SELECT和WHERE中使用表名的话，则必须使用表的别名，而不能使用表的原名。
SELECT
    emp.last_name,
    dept.department_name,
    dept.department_name
FROM
    employees emp,
    departments dept
WHERE
    emp.department_id = dept.department_id;

# 练习：查询员工的employee_id,last_name,deparment_name, city
SELECT
    e.employee_id,
    e.last_name,
    d.department_name,
    l.city
FROM
    employees e,
    departments d,
    locations l
WHERE
    e.department_id = d.department_id
    AND d.location_id = l.location_id;

# 等值连接VS非等值连接
# 非等值连接的例子
SELECT
    last_name,
    salary,
    grade_level
FROM employees e, job_grades j
WHERE
    e.salary BETWEEN j.lowest_sal
    AND j.highest_sal;

# 自连接 vs 非自连接
# 自连接
# 练习：查询员工id，员工姓名及其管理者的id和姓名
SELECT
    emp.employee_id,
    emp.last_name,
    mgr.employee_id,
    mgr.last_name
FROM
    employees emp,
    employees mgr
WHERE
    emp.manager_id = mgr.employee_id;

# 内连接 VS 外连接 
# 内连接 合并具有同一列的两个以上的表的行，结果集中不包含一个表与另一个表不匹配的行
SELECT
    employee_id,
    department_name
FROM employees e, departments d
WHERE
    e.department_id = d.department_id;

# 外连接 左外连接 右外连接 满外连接
# 左外连接
# SQL99语法中使用JOIN ... ON的方法实现多表查询
# SQL99语法实现内连接
SELECT
    employee_id,
    department_name
FROM employees e
    JOIN departments d ON e.department_id = d.department_id;

SELECT
    e.employee_id,
    e.last_name,
    d.department_name,
    l.city
FROM employees e
    JOIN departments d ON e.department_id = d.department_id
    JOIN locations l ON d.location_id = l.location_id;

# SQL99 语法实现外连接 
# 练习 查询所有员工的last_name, department_name信息
# 左外连接
SELECT
    last_name,
    department_name
FROM employees e
    LEFT JOIN departments d ON e.department_id = d.department_id;

# 右外连接
SELECT
    last_name,
    department_name
FROM employees e
    RIGHT JOIN departments d ON e.department_id = d.department_id;

# 满外接连 mysql不支持FULL OUTER JOIN
SELECT
    last_name,
    department_name
FROM employees e FULL OUTER
    JOIN departments d ON e.department_id = d.department_id;

# UNION 操作符 UNION ALL(重复的部分的不去重) 合并查询集 
# SQL99自然连接
SELECT
    employee_id,
    last_name,
    department_name
FROM employees e
    JOIN departments d ON e.department_id = d.department_id AND e.manager_id = d.manager_id;

SELECT
    employee_id,
    last_name,
    department_name
FROM employees e
    NATURAL JOIN departments d;

# SQL99 USING的使用
SELECT
    last_name,
    department_name
FROM employees e
    JOIN departments d ON e.department_id = d.department_id;

SELECT
    last_name,
    department_name
FROM employees e
    JOIN departments d USING (department_id);

# 练习1 显示所有员工的姓名、部门号和部门名称
SELECT
    emp.last_name,
    dep.department_id,
    dep.department_name
FROM employees emp
    LEFT JOIN departments dep ON emp.department_id = dep.department_id;

# 练习2 查询90号部门员工的job_id和 90号部门的localtion_id
SELECT
    e.job_id,
    d.location_id
FROM employees e
    JOIN departments d ON e.department_id = d.department_id
WHERE e.department_id = 90;

# 练习3 选择所有有奖金的员工的last_name, department_name, lacation_id, city
SELECT
    e.last_name,
    d.department_name,
    l.location_id,
    l.city
FROM employees e
    LEFT JOIN departments d ON e.department_id = d.department_id
    LEFT JOIN locations l ON d.location_id = l.location_id
WHERE
    e.commission_pct IS NOT NULL;

# 练习4. 选择city在Toronto工作的员工的last_name, job_id, dempartment_id, department_name
SELECT
    e.last_name,
    e.job_id,
    d.department_id,
    d.department_name
FROM employees e
    JOIN departments d ON e.department_id = d.department_id
    JOIN locations l ON d.location_id = l.location_id
WHERE l.city = 'Toronto';

# 练习5 查询哪些部门没有员工
SELECT d.department_id
FROM departments d
    LEFT JOIN employees e ON d.department_id = e.department_id
WHERE e.department_id IS NULL;

# 子查询
SELECT department_id
FROM departments d
WHERE NOT EXISTS (
        SELECT *
        FROM employees e
        WHERE
            e.department_id = d.department_id
    );

# 练习6 查询部门名为Sales或IT的员工信息
SELECT
    e.employee_id,
    e.last_name,
    e.department_id
FROM employees e
    JOIN departments d ON e.department_id = d.department_id
WHERE
    d.department_name IN ('Sales', 'IT');