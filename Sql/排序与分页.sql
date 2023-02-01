# 排序 # 如果没有使用排序操作，默认情况下查询返回的数据是按照添加数据的顺序显示的 SELECT * FROM employees;

# 练习，按照salary从高到低的顺序显示员工信息
# 使用 ORDER BY 对查询到的数据进行排序操作
# 升序 ASC 默认值
# 降序 DESC
SELECT
    employee_id,
    last_name,
    salary
FROM employees
ORDER BY salary DESC;

# 可以使用列的别名，进行排序
# 列的别名只能在ORDER BY 中使用，不能在WHERE中使用
SELECT
    employee_id,
    salary,
    salary * 12 annul_sal
FROM employees
ORDER BY annul_sal;

SELECT
    employee_id,
    salary,
    department_id
FROM employees
WHERE
    department_id IN (50, 60, 70)
ORDER BY department_id DESC;

# 二级排序 
# 练习 显示员工信息，按照department_id的降序排序，salary的升序排序
SELECT
    employee_id,
    salary,
    department_id
FROM employees
WHERE
    department_id IN (50, 60, 70)
ORDER BY
    department_id DESC,
    salary ASC;

# 分页
# mysql 使用LIMIT实现数据的分页显示
SELECT employee_id, last_name
FROM employees
LIMIT 0, 20;

SELECT
    employee_id,
    last_name,
    salary
FROM employees
WHERE salary > 6000
ORDER BY salary DESC
LIMIT 10
OFFSET 0;

# LIMIT 0, 10;

# MySQL8.0新特性：LIMIT ... OFFSET ... 
# 练习 选择工资不在8000到17000的员工的姓名和工资，按工资降序，显示第21到40位置的数据
SELECT last_name, salary
FROM employees
WHERE
    salary NOT BETWEEN 8000 AND 17000
ORDER BY salary DESC
LIMIT 20, 20;

# 练习 查询邮箱中包含e的员工信息，并先按照邮箱字节数排序，再按发部门号升序
SELECT
    employee_id,
    last_name,
    email,
    department_id
FROM employees
WHERE email LIKE '%e%'
ORDER BY
    LENGTH(email) DESC,
    department_id;