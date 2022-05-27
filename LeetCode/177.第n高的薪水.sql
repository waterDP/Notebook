--
-- @lc app=leetcode.cn id=177 lang=mysql
--
-- [177] 第N高的薪水
--

-- @lc code=start
CREATE FUNCTION getNthHighestSalary(N INT) RETURNS INT
BEGIN
  set N := N-1;
  RETURN (
    # Write your MySQL query statement below.
    select salary 
    from employee
    group by salary 
    order by salary DESC
    limit N, 1
  );
END
-- @lc code=end

