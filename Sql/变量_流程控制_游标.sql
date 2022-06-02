变量：系统变量（全局系统变量，会话系统变量）vs 用户自定义变量

show global variables;

show session variables;

show variables;

show global variables like 'admin_%';

set @@global.变量名 = 变量值
set global 变量名 = 变量值

set @@session.变量名 = 变量值
set session 变量名 = 变量值

# 会话用户变量
# 使用
set @m1 := 1;
set @m2 := 2;
set @sum := @m1 + @m2;
select @sum;

select @count := count(*) from employees;

select @count

select avg(salary) into @avg_sal from employees;

# 局部变量
定义 可以用declare定义一个局部变量
delimiter //

create procedure test_var()
begin
  #声明局部变量
  declare a int default 0;
  declare b int;
  declare emp_name varchar(25);

  # 赋值
  set a = 1;
  set b = 2;

  select last_name into emp_name from employees where employee_id = 101;

  # 使用
  select a, b, emp_name
end 

delimiter;

# 存储过程的使用
call test_var();

# 创建存储过程 "different_salary"查询某员工和他领导的薪资差距，
# 并有in参数emp_id接收员工Id，用out参数diff_salary输出薪资差距结果
delimiter //

create procedure different_salary(in emp_id int, out different_salary double)
begin
  declare emp_sal double default 0.0;
  declare mgr_sal double default 0.0;
  declare mgr_id int default 0;
  
  select salary into emp_id from employees where employee_id = emp_id;

  select mgr_id into mgr_id from employees where employee_id = emp_id;

  select salary into mgr_sal from employees where employee_id = mgr_id;

  set different_salary = mgr_sal - emp_sal;

end//

delimiter ;

# 流程控制
# 分支结构 if 
delimiter //
create procedure test_if()
begin
  #声明局部变量
  declare stu_name varchar(15)
  if stu_name is null
    then select 'stu_name is null'
  end if;  
end;
delimiter ;




delimiter //
create procedure test_if()
begin
  #声明局部变量
  declare email varchar(25);
  if email is null 
    then select 'email is null';
  else 
    select 'email is not null';
  end if;
end;
delimiter ;