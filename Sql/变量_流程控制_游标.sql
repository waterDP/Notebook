变量：系统变量（全局系统变量，会话系统变量）vs 用户自定义变量 show global variables;

show session variables;

show variables;

show global variables like 'admin_%';

set @@global.变量名 = 变量值
set global 变量名 = 变量值
set @@session.变量名 = 变量值
set
    session 变量名 = 变量值 # 会话用户变量
    # 使用
set @m1 := 1;

set @m2 := 2;

set @sum := @m1 + @m2;

select @sum;

select @count := count(*) from employees;

select @count select avg(salary) into @avg_sal from employees;

# 局部变量 定义 可以用declare定义一个局部变量 

delimiter //

create procedure TEST_VAR() begin 
	#声明局部变量 declare a int default 0;
	declare b int;
	declare emp_name varchar(25);
	# 赋值 set a = 1;
	set b = 2;
	select last_name into emp_name
	from employees
	where employee_id = 101;
	# 使用 select a, b, emp_name end 


delimiter;

# 存储过程的使用 call test_var();

# 创建存储过程 "different_salary"查询某员工和他领导的薪资差距，
# 并有in参数emp_id接收员工Id，用out参数diff_salary输出薪资差距结果

delimiter //

create procedure DIFFERENT_SALARY(in EMP_ID int, out 
DIFFERENT_SALARY double) begin 
	declare emp_sal double default 0.0;
	declare mgr_sal double default 0.0;
	declare mgr_id int default 0;
	select salary into emp_id
	from employees
	where employee_id = emp_id;
	select mgr_id into mgr_id
	from employees
	where employee_id = emp_id;
	select salary into mgr_sal
	from employees
	where employee_id = mgr_id;
	set DIFFERENT_SALARY = mgr_sal - emp_sal;
	end// 


delimiter ;

# 流程控制 # 分支结构 if 

delimiter //

create procedure TEST_IF() begin 
	#声明局部变量
	declare stu_name varchar(15) if stu_name is null then
	select
	    'stu_name is null'
	end if;
end; 

delimiter ;

delimiter //

create procedure TEST_IF() begin 
	#声明局部变量 declare email varchar(25);
	if email is null then select 'email is null';
	else select 'email is not null';
	end if;
end; 

delimiter ; #elseif

# 分支结构 case 

delimiter //

create procecdure test_case() begin declare var int default 2;

case var when 1 then select 'var = 1';

when 2 then select 'var = 2';

when 3 then select 'var = 3';

else select 'other value';

end case;

end// 

delimiter ;

# 声明存储过程"update_salary_by_eid4"，定义IN参数emp_id，输入员工编号判断该员工工资如果低于9000元，就更新薪资为9000元，薪资大于9000元低于10000的但是资金比例为null的，就更新资金比例为0.01；其他的涨薪100元

delimiter //

create procedure UPDATE_SALARY_BY_EID4(in EMP_ID int
) begin 
	#声明局部变量 declare emp_sal double;
	# 记录员工的工资 declare bonus double;
	# 记录员工的资金率
	#局部变量的赋值
	select salary into emp_sal
	from employees
	where employee_id = emp_id;
	select commision_pct into bonus
	from employees
	where employee_id = emp_id;
	case
	    when emp_sal < 9000 then employees
	    set salary = 9000
	    where employee_id = emp_id;
	when emp_sal < 10000
	and bonus is null then
	update
	set commision_pct = 0.01
	where employee_id = emp_id;
	else
	update employees
	set salary = salary + 100
	where employee_id = emp_id;
	end case;
	end// 


delimiter ;

# 调用 call update_salary_by_eid4();

# 循环结构 loop 

delimiter //

create procedure TEST_LOOP() begin 
	# 声明局部变量 declare num int default 1;
	loop_label:
	loop
	set num = num + 1 if num > 10 then
	leave loop_label;
	end if;
	end loop loop_label;
	# 查看num select num;
	end // 


delimiter ;

# 声明存储过程"update_salary_loop()", 声明out参数num，输出循环次数，存储过程实现给大家涨薪，薪资涨为原来的1.1倍。直至公司的平均薪资达到12000结束。并统计循环次数

delimiter //

create procedure UPDATE_SALARY_LOOP(out NUM int) begin 
	#声明局部变量 declare avg_sal double;
	declare loop_count int default 0;
	loop_label:loop select avg(salary) into avg_sal from employees;
	if avg_sal > 12000 then leave loop_label;
	end if;
	update employees set salary = salary * 1.1;
	set loop_count = loop_count + 1;
	end loop loop_label set num = loop_count;
	end // 


delimiter ;

# 循环结构之 while
# 声明存储过程"update_salary_while()",声明out参数为num,输出循环次数 存储过程实现循环给大家降薪，薪资降为原来的90%。直到全公司的平均薪资，达到5000结束，并统计循环次数

delimiter //

create procedure UPDATE_SALARY_WHILE(out NUM int) begin 
	declare ava_sal double declare while_count int default 0;
	select avg(salary) into avg_sal from employees;
	while avg_sal > 5000
	do
	update employees
	set salary = salary * 0.9;
	set while_count = while_count + 1;
	select avg(salary) into ava_sal from employees;
	end while;
	set num = whi le_count;
	end // 


delimiter ;

# 循环结构repeat
repeat
...until...# 游标
    声明地游标 declare cursor_name cursor for
select select_statement;

# 举例：创建存储过程"get_count_by_limit_total_salary()"，声明in参数limit_total_salary double类型,声明out参数total_count,int类型。函数的功能可以实现累加薪资最高的几个员工的薪资值，直到薪资总和达到limit_total_salary参数的值，返回累加的人数给total_count

delimiter //

create procedure GET_COUNT_BY_LIMIT_TOTAL_SALARY(in 
LIMIT_TOTAL_SALARY double, out TOTAL_COUNT int) begin 
	#声明局部变量 declare sum_sal double default 0.0;
	declare emp_sal double;
	declare emp_count int default 0;
	#声明游标
	declare emp_cursor cursor for
	select salary
	from employees
	order by salary desc;
	#打开游标 open emp_cursor;
	repeat #使用游标 fetch emp_cursor into emp_sal;
	set sum_sal = sum_sal + emp_sal;
	set emp_count = emp_count + 1;
	until sum_sal >= limit_total_salary end repeat;
	set total_count = emp_count;
	# 关闭游标 close emp_cursor;
	end // 


delimiter ;