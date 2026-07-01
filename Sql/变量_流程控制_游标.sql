变量：系统变量（全局系统变量，会话系统变量）vs 用户自定义变量 SHOW GLOBAL variables;

SHOW SESSION variables;

SHOW variables;

SHOW GLOBAL variables like 'admin_%';

SET @@ global.变量名 = 变量值
SET GLOBAL 变量名 = 变量值
SET @@ session.变量名 = 变量值
SET SESSION 变量名 = 变量值 # 会话用户变量
 # 使用
SET @m1 := 1;

SET @m2 := 2;

SET @sum := @m1 + @m2;

SELECT @sum;

SELECT @count := count(*)
FROM employees;

SELECT @count
SELECT avg(salary) INTO @avg_sal
FROM employees;

# 局部变量 定义 可以用declare定义一个局部变量

DELIMITER //
CREATE PROCEDURE TEST_VAR() BEGIN # 声明局部变量 DECLARE a int DEFAULT 0; DECLARE b int; DECLARE emp_name varchar(25); # 赋值 set a = 1;

SET b = 2;
SELECT last_name INTO emp_name
FROM employees
WHERE employee_id = 101; # 使用 select a, b, emp_name end

    DELIMITER; # 存储过程的使用 call test_var();
 # 创建存储过程 "different_salary"查询某员工和他领导的薪资差距，
# 并有in参数emp_id接收员工Id，用out参数diff_salary输出薪资差距结果

    DELIMITER //
    CREATE PROCEDURE DIFFERENT_SALARY(IN EMP_ID int, OUT DIFFERENT_SALARY DOUBLE) BEGIN DECLARE emp_sal DOUBLE DEFAULT 0.0; DECLARE mgr_sal DOUBLE DEFAULT 0.0; DECLARE mgr_id int DEFAULT 0;
    SELECT salary INTO emp_id
    FROM employees
    WHERE employee_id = emp_id;
        SELECT mgr_id INTO mgr_id
    FROM employees
    WHERE employee_id = emp_id;
        SELECT salary INTO mgr_sal
    FROM employees
    WHERE employee_id = mgr_id;
        SET DIFFERENT_SALARY = mgr_sal - emp_sal; END //
    DELIMITER ; # 流程控制 # 分支结构 if

    DELIMITER //
    CREATE PROCEDURE TEST_IF() BEGIN # 声明局部变量 DECLARE stu_name varchar(15) IF stu_name IS NULL THEN
    SELECT 'stu_name is null' END IF; END;
    DELIMITER ;
    DELIMITER //
    CREATE PROCEDURE TEST_IF() BEGIN # 声明局部变量 DECLARE email varchar(25); IF email IS NULL THEN
    SELECT 'email is null'; ELSE
    SELECT 'email is not null'; END IF; END;
    DELIMITER ; #elseif # 分支结构 case

    DELIMITER //
    CREATE procecdure test_case() BEGIN DECLARE var int DEFAULT 2; CASE var WHEN 1 THEN
                                                                            SELECT 'var = 1'; WHEN 2 THEN
                                                                            SELECT 'var = 2'; WHEN 3 THEN
                                                                            SELECT 'var = 3'; ELSE
                                                                            SELECT 'other value';
                                                                   END CASE;
                                                                       END //
    DELIMITER ; # 声明存储过程"update_salary_by_eid4"，定义IN参数emp_id，输入员工编号判断该员工工资如果低于9000元，就更新薪资为9000元，薪资大于9000元低于10000的但是资金比例为null的，就更新资金比例为0.01；其他的涨薪100元

    DELIMITER //
    CREATE PROCEDURE UPDATE_SALARY_BY_EID4(IN EMP_ID int) BEGIN # 声明局部变量 DECLARE emp_sal DOUBLE; # 记录员工的工资 declare bonus double;
 # 记录员工的资金率
 # 局部变量的赋值
    SELECT salary INTO emp_sal
    FROM employees
    WHERE employee_id = emp_id;
        SELECT commision_pct INTO bonus
    FROM employees
    WHERE employee_id = emp_id; CASE
                                    WHEN emp_sal < 9000 THEN employees
                                         SET salary = 9000
                                         WHERE employee_id = emp_id; WHEN emp_sal < 10000
                                             AND bonus IS NULL THEN
                                             UPDATE
                                             SET commision_pct = 0.01 WHERE employee_id = emp_id; ELSE
                                             UPDATE employees
                                             SET salary = salary + 100 WHERE employee_id = emp_id; END CASE;
                                                                                                       END //
        DELIMITER ; # 调用 call update_salary_by_eid4();
 # 循环结构 loop

        DELIMITER //
        CREATE PROCEDURE TEST_LOOP() BEGIN # 声明局部变量 declare num int default 1;
 loop_label: LOOP
        SET num = num + 1 IF num > 10 THEN LEAVE loop_label; END IF; END LOOP loop_label; # 查看num select num;
 END //
        DELIMITER ; # 声明存储过程"update_salary_loop()", 声明out参数num，输出循环次数，存储过程实现给大家涨薪，薪资涨为原来的1.1倍。直至公司的平均薪资达到12000结束。并统计循环次数

        DELIMITER //
        CREATE PROCEDURE UPDATE_SALARY_LOOP(OUT NUM int) BEGIN # 声明局部变量 DECLARE avg_sal DOUBLE; DECLARE loop_count int DEFAULT 0; loop_label:LOOP
        SELECT avg(salary) INTO avg_sal
        FROM employees; IF avg_sal > 12000 THEN LEAVE loop_label; END IF;
        UPDATE employees
        SET salary = salary * 1.1;
        SET loop_count = loop_count + 1; END LOOP loop_label
        SET num = loop_count; END //
        DELIMITER ; # 循环结构之 while
# 声明存储过程"update_salary_while()",声明out参数为num,输出循环次数 存储过程实现循环给大家降薪，薪资降为原来的90%。直到全公司的平均薪资，达到5000结束，并统计循环次数

        DELIMITER //
        CREATE PROCEDURE UPDATE_SALARY_WHILE(OUT NUM int) BEGIN DECLARE ava_sal DOUBLE DECLARE while_count int DEFAULT 0;
        SELECT avg(salary) INTO avg_sal
        FROM employees; WHILE avg_sal > 5000 DO
        UPDATE employees
        SET salary = salary * 0.9;
        SET while_count = while_count + 1;
        SELECT avg(salary) INTO ava_sal
        FROM employees; END WHILE;
        SET num = whi le_count; END //
        DELIMITER ; # 循环结构repeat
repeat ...until...# 游标
 声明地游标 DECLARE
        CURSOR_NAME
        CURSOR
        FOR
        SELECT select_statement; # 举例：创建存储过程"get_count_by_limit_total_salary()"，声明in参数limit_total_salary double类型,声明out参数total_count,int类型。函数的功能可以实现累加薪资最高的几个员工的薪资值，直到薪资总和达到limit_total_salary参数的值，返回累加的人数给total_count

        DELIMITER //
        CREATE PROCEDURE GET_COUNT_BY_LIMIT_TOTAL_SALARY(IN LIMIT_TOTAL_SALARY DOUBLE, OUT TOTAL_COUNT int) BEGIN # 声明局部变量 DECLARE sum_sal DOUBLE DEFAULT 0.0; DECLARE emp_sal DOUBLE; DECLARE emp_count int DEFAULT 0; # 声明游标 DECLARE emp_cursor
        CURSOR
        FOR
        SELECT salary
        FROM employees
        ORDER BY salary DESC; # 打开游标 OPEN emp_cursor; repeat # 使用游标 FETCH emp_cursor INTO emp_sal;
        SET sum_sal = sum_sal + emp_sal;
        SET emp_count = emp_count + 1; UNTIL sum_sal >= limit_total_salary END repeat;
        SET total_count = emp_count; # 关闭游标 close emp_cursor;
 END //
    DELIMITER ;