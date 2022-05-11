--
-- @lc app=leetcode.cn id=176 lang=mysql
--
-- [176] 第二高的薪水
--

-- @lc code=start
# Write your MySQL query statement below
select 
  ifnull(
    (
      select distinct salary
      from employee
      order by salary desc
      limit 1 offset 1
    ),
    null
  )
as SecondHighestSalary;
-- @lc code=end

