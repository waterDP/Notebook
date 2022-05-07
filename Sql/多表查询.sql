# SQL92 语法实现外连接：使用+
SELECT employee_id, department_name
FROM employees e, departments d
WHERE e.department_id = d.department_id(+);

# SQL99语法实现内连接
SELECT last_name, department_name
FROM employees e INNER JOIN departments d
ON e.department_id = d.department_id;

SELECT last_name, department_name, city
FROM employees e JOIN departments d 
ON e.department_id = d.department_id
JOIN locations l
ON d.location_id = l.location_id

# SQL99语法中使用JOIN...ON的方式实现多表的查询。这种方式也能外连接问题
# 左外连接
SELECT last_name, department_name
FROM employees e LEFT JOIN departments d
ON e.department_id = d.department_id;

#右外连接
SELECT last_name, department_name
FROM employees e RIGHT JOIN departments d
ON e.department_id = d.department_id;

#满外连接 mySql 不支持
SELECT last_name, department_name
FROM employees e  FULL OUTER JOIN departments d
ON e.department_id = d.department_id;

# UNION 和 UNION ALL 的使用
# UNION 会进行去重操作
# UNION ALL 不进行去重操作

# 自然连接
# 它会帮你自动查询两张连接表中所有相同的字段 然后进行等值连接
SELECT employee_id, last_name, department_name
FROM empoyees e NATURAL JOIN departments d;

# USING
SELECT emplyee_id, last_name, department_name
FROM employees e JOIN departments d
USING (department_id)

# 选择city在Toronto工作的员工的last_name, job_id, department_id, department_name
SELECT e.last_name, e.job_id, d.department_id, d.department_name
FROM employees e JOIN departments
ON e.department_id = d.department_id
JOIN locations l
ON d.location_id = l.location_id
WHERE l.city = 'Toronto';

# 查询哪些部门没有员工
SELECT d.department_id
FROM departments d LEFT JOIN employees e
USING (department_id)
WHERE e.department_id IS NULL;

# 子查询实现
SELECT department_id
FROM departments d
WHERE NOT EXISTS (
  SELECT *
  FROM employees e
  WHERE e.department_id = d.department_id
);

