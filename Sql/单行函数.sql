# 数值函数
RADIANS() # 弧度换成角度
DEGREES() # 角度换弧度
# 字符串函数
ASCII('as') #  返回第一个字母的ASCII码ADD
CHAR_LENGTH() # 字符个数
length() # 字节个数
CONCAT(x1, x2, x3,...); # 连接字符

select
    CONCAT(
        emp.last_name,
        ' worked for ',
        mgr.last_name
    ) "details"
from employees emp
    join employees mgr
where
    emp.manager_id = mgr.employee_id;

# 用'-'链接 replace ('hello', 'll', 'mm');

select CONCAT_WS('-', 'x1', 'x2', 'x3') from DUAL;

LPAD() # 实现右对齐效果
RPAD() # 实现左对齐效果
TRIM(
    'oo'
    from
        'oohello'
) # hello
SUBSTR(s, index, len) LOCATE(substr, str) # 返回str字符串在substr字符串首次出现的位置 没有返回0
REVERSE(str) # 
# 日期时间函数
CURDATE() CURRENT_DATE() CURTIME() NOW() SYSDATE() UTC_DATE() UTC_TIME() UNIX_TIMESTAMP() # 以UNIX时间戳的形式返回当前时间
from_UNIXTIME(163432237571) # 流程控制函数
if(value, value1, value2) # 如果value的值为TRUE, 返回value1 否则返回value2
IFNULL(value1, value2) # 如果value1不为NULL, 返回value1，否则返回value2
select
    last_name,
    salary,
    if(salary >= 60000, '高工资', '低工资') "details"
from employees;

select
    last_name,
    salary,
    CASE
        when salary >= 15000 then '白骨精'
        when salary >= 10000 then '潜力股'
        when salary >= 8000 then '小屌丝'
        else '草根'
    end 'details'
from employees;