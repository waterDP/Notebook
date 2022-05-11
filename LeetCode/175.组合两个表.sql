--
-- @lc app=leetcode.cn id=175 lang=mysql
--
-- [175] 组合两个表
--

-- @lc code=start
# Write your MySQL query statement below
select p.firstName, p.lastname, d.city, d.state
from Person p left join `Address` d
on p.personId = d.personId;
-- @lc code=end

