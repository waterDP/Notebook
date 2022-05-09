# 数值函数
radians()  # 弧度换成角度
degrees()  # 角度换弧度

# 字符串函数
ascii('as') #  返回第一个字母的ASCII码ADD
char_length() # 字符个数
length()  # 字节个数
concat(x1, x2, x3, ...) # 连接字符

select concat(emp.last_name, ' worked for', mgr.last_name) "details"
from employees emp join employees mgr
where emp.manager_id = mgr.employee_id

concat_ws('-', x1, x2, x3) # 用'-'链接

replace('hello', 'll', 'mm');

lpad() # 实现右对齐效果
rpad() # 实现左对齐效果

trim('oo' from 'oohello') # hello

strcpm(s1, s2) # 比较字符串s1, s2的ASCII码值的大小

substr(s, index, len)

locate(substr, str) # 返回str字符串在substr字符串首次出现的位置 没有返回0

reverse(str) # 

# 日期时间函数
curdate() current_date()
curtime() now() sysdate()
utc_date() utc_time()

unix_timestamp() # 以UNIX时间戳的形式返回当前时间
from_unixtime(163432237571)


# 流程控制函数
if(value, value1, value2) # 如果value的值为TRUE, 返回value1 否则返回value2
ifnull(value1, value2)  # 如果value1不为NULL, 返回value1，否则返回value2

select last_name, salary, if(salary >= 60000, '高工资', '低工资') "details"
from employees;

select  last_name
       ,salary
       ,case when salary >= 15000 then '白骨精'
             when salary >= 10000 then '潜力股'
             when salary >= 8000 then '小屌丝'  else '草根' end 'details'
from employees;