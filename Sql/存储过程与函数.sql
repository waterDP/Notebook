#1 创建存储过程 # 类型一 无参数无返回值 # 举例1：创建存储过程select_all_data(), 相看emps表的所有数据

delimiter $

create procedure select_ALL_DATA() begin 
	select * from employees;
	end

$

delimiter;

# 存储过程的调用 call select_all_data();

# 举例2：创建存储过程avg_employee_salary(), 返回所有员工的平均工资

delimiter $

create procedure AVG_EMPLOYEE_SALARY() begin 
	select avg(salary) from employees;
	end

$

delimiter;

# 调用
call
    avg_employee_salary() # 类型二 带out
    # 举例 创建存储过程show_min_salary 查看emps表的最低薪资值。并将最低薪资通过OUT参数'ms'输出
    desc employees

delimiter /
/

create procedure SHOW_MIN_SALARY(out MS double) begin 
	select min(salary) into ms from emps;
	end
/
/

delimiter;

# 调用 call show_min_salary(@ms) # 查看变量值 select @ms;

# 类型三 带in
# 举例 创建存储过程show_someone_salary(),查看"emps"表的某个员工的薪资，并用in参数empname输入员工姓名

delimiter //

create procedure SHOW_SOMEONE_SALARY(in EMPNAME varchar
(20)) begin 
	select salary from emps where last_name = empname;
	end
/
/

delimiter;

# 调用方式一
call
    show_someone_salary('Abel') # 调用方式二
set @empname := 'Abel'
call
    show_someone_salary(@empname) # 类型四 带in和out
    # 举例 创建存储过程show_someone_salary2(),查看emps表的某个员工的薪资
    # 并用in 参数empname输入员工姓名，用out参数empslary输出员工薪资

delimiter /
/

create procedure SHOW_SOMEONE_SALARY(in EMPNAME varchar
(2), out EMPSALARY double) begin 
	select salary into empsalary
	from emps
	where last_name = empname;
	end
/
/

delimiter;

# 调用
set @empname = 'Abel'
call
    show_somone_slary2(@empname, @empsalary);

select @empsalary # 类型五：带inout
    # 举例 创建存储过程show_mgr_name(),查询某个员工领导的姓名，并用inout参数empname输入员工姓名，输出领导的姓名

delimiter $

create procedure SHOW_MGR_NAME(inout EMPNAME varchar(25)) begin 
	select last_name into empname
	from emps
	where employee_id = (
	        select manager_id
	        from emps
	        where
	            last_name = empname
	    );
	end;

delimiter;

# 调用
set @empname := 'Abel'
call show_mgr_name(@empname)
select @empname;

# 存储函数
# 例 创建存储函数，名称为email_by_name()，参数定义为空 该函数查询为Abell的email,并返回，数据类型为字符串类型的

delimiter //

create FUNCTION EMAIL_BY_NAME() returns varchar(25) 
deterministic contains sql reads sql data begin 
	return (
	        select email
	        from emps
	        where
	            last_name = 'Abel'
	    )
	end
//

delimiter $

# 调用 select email_by_name();