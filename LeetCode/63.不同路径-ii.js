/*
 * @Author: water.li
 * @Date: 2022-04-05 22:49:52
 * @Description: 
 * @FilePath: \notebook\LeetCode\63.不同路径-ii.js
 */
/*
 * @lc app=leetcode.cn id=63 lang=javascript
 *
 * [63] 不同路径 II
 *
 * https://leetcode-cn.com/problems/unique-paths-ii/description/
 *
 * algorithms
 * Medium (39.98%)
 * Likes:    764
 * Dislikes: 0
 * Total Accepted:    239.7K
 * Total Submissions: 599.5K
 * Testcase Example:  '[[0,0,0],[0,1,0],[0,0,0]]'
 *
 * 一个机器人位于一个 m x n 网格的左上角 （起始点在下图中标记为 “Start” ）。
 * 
 * 机器人每次只能向下或者向右移动一步。机器人试图达到网格的右下角（在下图中标记为 “Finish”）。
 * 
 * 现在考虑网格中有障碍物。那么从左上角到右下角将会有多少条不同的路径？
 * 
 * 网格中的障碍物和空位置分别用 1 和 0 来表示。
 * 
 * 
 * 
 * 示例 1：
 * 
 * 
 * 输入：obstacleGrid = [[0,0,0],[0,1,0],[0,0,0]]
 * 输出：2
 * 解释：3x3 网格的正中间有一个障碍物。
 * 从左上角到右下角一共有 2 条不同的路径：
 * 1. 向右 -> 向右 -> 向下 -> 向下
 * 2. 向下 -> 向下 -> 向右 -> 向右
 * 
 * 
 * 示例 2：
 * 
 * 
 * 输入：obstacleGrid = [[0,1],[0,0]]
 * 输出：1
 * 
 * 
 * 
 * 
 * 提示：
 * 
 * 
 * m == obstacleGrid.length
 * n == obstacleGrid[i].length
 * 1 <= m, n <= 100
 * obstacleGrid[i][j] 为 0 或 1
 * 
 * 
 */

// @lc code=start
/**
 * @param {number[][]} obstacleGrid
 * @return {number}
 */
var uniquePathsWithObstacles = function(obstacleGrid) {
  const m = obstacleGrid.length, n = obstacleGrid[0].length
  const dp = new Array(m).fill(0).map(() => new Array(n).fill(0))
  if (obstacleGrid[0][0]) return 0
  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      if (obstacleGrid[i][j] === 0) {
        if (i !== 0 && j !== 0) {
          dp[i][j] = dp[i-1][j] + dp[i][j-1]
        } else if (i === 0 && j === 0) {
          dp[i][j] = 1
        } else if (i === 0) {
          if (!obstacleGrid[i][j] && dp[i][j-1]) {
            dp[i][j] = 1
          }
        } else if (j === 0) {
          if (!obstacleGrid[i][j] && dp[i-1][j]) {
            dp[i][j] = 1
          }
        }
      }
    }
  }
  return dp[m-1][n-1]
};
uniquePathsWithObstacles([[1,0]])
// @lc code=end

