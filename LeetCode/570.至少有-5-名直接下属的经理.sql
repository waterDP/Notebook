--

-- @lc app=leetcode.cn id=570 lang=mysql

--

-- [570] 至少有5名直接下属的经理

--

-- https://leetcode.cn/problems/managers-with-at-least-5-direct-reports/description/

--

-- database

-- Medium (61.71%)

-- Likes:    90

-- Dislikes: 0

-- Total Accepted:    52.4K

-- Total Submissions: 86.5K

-- Testcase Example:  '{"headers": {"Employee": ["id", "name", "department", "managerId"]}, "rows": {"Employee": [[101, "John", "A", null],[102, "Dan", "A", 101], [103, "James", "A", 101], [104, "Amy", "A", 101], [105, "Anne", "A", 101], [106, "Ron", "B", 101]]}}'

--

-- 表: Employee

--

--

-- +-------------+---------+

-- | Column Name | Type    |

-- +-------------+---------+

-- | id          | int     |

-- | name        | varchar |

-- | department  | varchar |

-- | managerId   | int     |

-- +-------------+---------+

-- 在 SQL 中，id 是该表的主键列。

-- 该表的每一行都表示雇员的名字、他们的部门和他们的经理的id。

-- 如果managerId为空，则该员工没有经理。

-- 没有员工会成为自己的管理者。

--

--

--

--

-- 查询至少有5名直接下属的经理 。

--

-- 以 任意顺序 返回结果表。

--

-- 查询结果格式如下所示。

--

--

--

-- 示例 1:

--

--

-- 输入:

-- Employee 表:

-- +-----+-------+------------+-----------+

-- | id  | name  | department | managerId |

-- +-----+-------+------------+-----------+

-- | 101 | John  | A          | None      |

-- | 102 | Dan   | A          | 101       |

-- | 103 | James | A          | 101       |

-- | 104 | Amy   | A          | 101       |

-- | 105 | Anne  | A          | 101       |

-- | 106 | Ron   | B          | 101       |

-- +-----+-------+------------+-----------+

-- 输出:

-- +------+

-- | name |

-- +------+

-- | John |

-- +------+

--

--

-- @lc code=start

# Write your MySQL query statement below

SELECT Employee.Name as Name
FROM (
        select ManagerId as Id
        FROM Employee
        GROUP BY ManagerId
        HAVING
            COUNT(Id) >= 5
    ) as Manager
    join Employee ON Manager.id = Employee.id 
    
-- @lc code=end

