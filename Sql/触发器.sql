# 创建触发器
create trigger 触发器名称
{before|after} {insert|update|delete} on 表名
for each row
触发器执行的语句块；

# 创建名称为before_insert_test_tri的触发器，向test_trigger数据表插入数据之前向test_trigger_log数据表中插入before_insert的日志信息

delimiter $

CREATE TRIGGER BEFORE_INSERT_TEST_TRI BEFORE INSERT 
ON TEST_TRIGGER FOR EACH ROW BEGIN 
	insert into test_trigger_log(t_log) values('before insert ...');
	end 
$ 

delimiter ;

# 定义触发器"salary_check_trigger"，基于员工表employees的insert事件，在insert之前检查将要添加的新员工是否大于他的领导的薪资，如果大于领导薪资，则报sqlstate_value为'HY000'的错误，从而使得添加失败

delimiter $

CREATE TRIGGER ALARY_CHECK_TRIGGER BEFORE INSERT ON 
EMPLOYEES FOR EACH ROW BEGIN 
	# 查询到要添加数据的manage的薪资 declare mgr_sal double;
	select salary into mgr_sal
	from employees
	where
	    employee_id = new.manager_id;
	if new.salary > mgr_sal then signal sqlstate 'HY000'
	set
	    message_text = '薪资高于领导薪资错误';
	end if;
	end 
$ 

delimiter ;

# 查看触发器 show triggers;

show create trigger 名称;