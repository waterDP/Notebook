--
-- @lc app=leetcode.cn id=184 lang=mysql
--
-- [184] 部门工资最高的员工
--

-- @lc code=start
# Write your MySQL query statement below
select 
  Department.name as 'Department',
  Employee.name as 'Employee',
  Salary
from 
  Employee
  join
  Department on Employee.DepartmentId = Department.Id
where 
  (Employee.DepartmentId, Salary) in
  (
    select 
      DepartmentId, Max(Salary)
    from Employee
    group by DepartmentId
  )
-- @lc code=end

