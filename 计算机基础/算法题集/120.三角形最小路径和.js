/*
 * @lc app=leetcode.cn id=120 lang=javascript
 *
 * [120] 三角形最小路径和
 */

// @lc code=start
/**
 * @param {number[][]} triangle
 * @return {number}
 */
var minimumTotal = function(triangle) {
  const m = triangle.length
  const dp = new Array(m).fill(0).map(() => new Array())
  dp[0][0] = triangle[0][0]
  for (let i = 1; i < m; i++) {
    dp[i][0] = dp[i-1][0] + triangle[i][0]
    for (let j = 1; j < i; j++) {
      dp[i][j] = Math.min(dp[i-1][j-1], dp[i-1][j]) + triangle[i][j]
    }
    dp[i][i] = dp[i-1][i-1] + triangle[i][i]
  }
  return Math.min(...dp[m-1])
};
// @lc code=end


// @after-stub-for-debug-begin
module.exports = minimumTotal;
// @after-stub-for-debug-end