# 创建视图
# 单表

CREATE VIEW vu_empl AS
SELECT employee_id, last_name, salary
FROM emps;

CREATE VIEW VU_EMP2(EMP_ID, `NAME`, MONTHLY_SAL) AS
SELECT employee_id, last_name, salary
FROM emp3
WHERE salary > 8000;

CREATE VIEW VU_EMP_SAL AS
SELECT department_id, avg(salary) avg_sal
FROM emps
WHERE department_id IS NOT NULL
GROUP BY department_id # 多表

CREATE VIEW vu_emp_dept AS
SELECT e.employees_id, e.department_id, d.department_name
FROM emps e
JOIN depts d ON e.department_id = d.department_id # 基于视图来创建视图

CREATE VIEW vu_emp4 AS
SELECT employees_id, last_name
FROM VU_EMP1;

# 查看视图 # 1. 查看数据库的表对象，视图对象 show tables;
 # 2. 查看视图的结构
DESC viewname # 3. 查看视图的属性信息
SHOW TABLE status like 'vu_empl' # 4. 查看视图的详细定义信息
SHOW
CREATE VIEW vu_empl;

SELECT *
FROM vu_empl;

SELECT employee_id, last_name, salary
FROM emps # 更新视图中的数据，会导致基表中数据改变

UPDATE VIEW vu_emp1
SET salary = 2000
WHERE employee_id = 101;

# 修改表
# 修改表中的数据，会导致视图中的数据改变

UPDATE emps
SET salary = 1000
WHERE employee_id = 101;

# 修改视图
# 方式一

CREATE
OR
REPLACE VIEW vu_empl AS
SELECT employee_id, last_name, salary, email
FROM emps
WHERE salary > 7000;

# 方式二
ALTER VIEW vu_emp1 AS
SELECT employee_id, last_name, salary, email, hire_date
FROM emps;

# 删除视图 drop view vu_emp4;

DROP VIEW IF EXISTS vu_emp3, vu_emp3;