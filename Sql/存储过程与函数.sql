# 1 创建存储过程 # 类型一 无参数无返回值 # 举例1：创建存储过程select_all_data(), 相看emps表的所有数据

DELIMITER $
CREATE PROCEDURE select_ALL_DATA() BEGIN
SELECT *
FROM employees; END $
DELIMITER ;

# 存储过程的调用 call select_all_data();
 # 举例2：创建存储过程avg_employee_salary(), 返回所有员工的平均工资

DELIMITER $
CREATE PROCEDURE AVG_EMPLOYEE_SALARY() BEGIN
SELECT avg(salary)
FROM employees; END $
DELIMITER ;

# 调用
CALL avg_employee_salary() # 类型二 带out
 # 举例 创建存储过程show_min_salary 查看emps表的最低薪资值。并将最低薪资通过OUT参数'ms'输出
 DESC employees
DELIMITER //
CREATE PROCEDURE SHOW_MIN_SALARY(OUT MS DOUBLE) BEGIN
SELECT min(salary) INTO ms
FROM emps; END //
DELIMITER;

# 调用 call show_min_salary(@ms) # 查看变量值 select @ms;
 # 类型三 带in
# 举例 创建存储过程show_someone_salary(),查看"emps"表的某个员工的薪资，并用in参数empname输入员工姓名

DELIMITER //
CREATE PROCEDURE SHOW_SOMEONE_SALARY(IN EMPNAME varchar (20)) BEGIN
SELECT salary
FROM emps
WHERE last_name = empname; END //
DELIMITER;

# 调用方式一
CALL show_someone_salary('Abel') # 调用方式二
SET @empname := 'Abel' CALL show_someone_salary(@empname) # 类型四 带in和out
 # 举例 创建存储过程show_someone_salary2(),查看emps表的某个员工的薪资
 # 并用in 参数empname输入员工姓名，用out参数empslary输出员工薪资

DELIMITER //
CREATE PROCEDURE SHOW_SOMEONE_SALARY(IN EMPNAME varchar (2), OUT EMPSALARY DOUBLE) BEGIN
SELECT salary INTO empsalary
FROM emps
WHERE last_name = empname; END //
DELIMITER;

# 调用
SET @empname = 'Abel' CALL show_somone_slary2(@empname, @empsalary);

SELECT @empsalary # 类型五：带inout
 # 举例 创建存储过程show_mgr_name(),查询某个员工领导的姓名，并用inout参数empname输入员工姓名，输出领导的姓名

DELIMITER $
CREATE PROCEDURE SHOW_MGR_NAME(INOUT EMPNAME varchar(25)) BEGIN
SELECT last_name INTO empname
FROM emps
WHERE employee_id =
        (SELECT manager_id
         FROM emps
         WHERE last_name = empname); END;

DELIMITER;

# 调用
SET @empname := 'Abel' CALL show_mgr_name(@empname)
SELECT @empname;

# 存储函数
# 例 创建存储函数，名称为email_by_name()，参数定义为空 该函数查询为Abell的email,并返回，数据类型为字符串类型的

DELIMITER //
CREATE FUNCTION EMAIL_BY_NAME() RETURNS varchar(25) DETERMINISTIC CONTAINS SQL READS SQL DATA BEGIN RETURN
    (SELECT email
     FROM emps
     WHERE last_name = 'Abel') END //
DELIMITER $ # 调用 select email_by_name();