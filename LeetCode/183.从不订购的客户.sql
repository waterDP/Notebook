--

-- @lc app=leetcode.cn id=183 lang=mysql

--

-- [183] 从不订购的客户

--

-- https://leetcode.cn/problems/customers-who-never-order/description/

--

-- database

-- Easy (66.39%)

-- Likes:    422

-- Dislikes: 0

-- Total Accepted:    309.2K

-- Total Submissions: 465.7K

-- Testcase Example:  '{"headers": {"Customers": ["id", "name"], "Orders": ["id", "customerId"]}, "rows": {"Customers": [[1, "Joe"], [2, "Henry"], [3, "Sam"], [4, "Max"]], "Orders": [[1, 3], [2, 1]]}}'

--

-- 某网站包含两个表，Customers 表和 Orders 表。编写一个 SQL 查询，找出所有从不订购任何东西的客户。

--

-- Customers 表：

--

-- +----+-------+

-- | Id | Name  |

-- +----+-------+

-- | 1  | Joe   |

-- | 2  | Henry |

-- | 3  | Sam   |

-- | 4  | Max   |

-- +----+-------+

--

--

-- Orders 表：

--

-- +----+------------+

-- | Id | CustomerId |

-- +----+------------+

-- | 1  | 3          |

-- | 2  | 1          |

-- +----+------------+

--

--

-- 例如给定上述表格，你的查询应返回：

--

-- +-----------+

-- | Customers |

-- +-----------+

-- | Henry     |

-- | Max       |

-- +-----------+

--

--

--

-- @lc code=start

# Write your MySQL query statement below
SELECT c.Name AS Customers
FROM Customers as c
    LEFT JOIN Orders as o ON c.Id = o.customerId
WHERE o.Id IS NULL;

-- @lc code=end