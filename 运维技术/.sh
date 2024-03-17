# !/bin/bash
###
 # @Author: water.li
 # @Date: 2024-02-05 19:06:05
 # @Description: 
 # @FilePath: \Notebook\运维技术\.sh
### 

echo hello

# 管道分隔符
echo 1; echo 2;

# 管道与
echo 1 && echo 2;

# 管道或
echo 1 || echo 2;

# 管道运算
[command1] | [command2] # 命令1的结果成为命令2的输入

# 通配符
> ?   匹配一个任意字符
> .   匹配0个或任意字符，也就是可以匹配任意内容
> []  匹配中括号中的任意一个字符
> [-] 匹配中括号中的任意一个字符，-代表范围
> [^] 匹配不是中括号中的一个字符



# nginx日志切割
# !/bin/bash
logs_path="/opt/nginx/logs"
mkdir -p ${logs_path}$(date -d "yestoday" + "%Y")/$(date -d "yestoday" +"%m")
mv ${logs_path}access.log ${logs_path}$(date -d "yestoday" + "%Y")/$(date -d "yestoday" +"%m")/access_$(date -d "yestoday" +"%Y-%m-%d").log
# nginx -s reopen
kill -USR1 `cat /opt/nginx/logs/nginx.pid`