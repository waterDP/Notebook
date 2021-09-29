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
  const dp = new Array(m).fill(0).map(() => [])
  dp[m-1] = [...triangle[m-1]]
  for (let i = m - 2; i >= 0; i--) {
    for (let j = 0; j <= i; j++) {
      dp[i][j] = Math.min(dp[i+1][j+1], dp[i+1][j]) + triangle[i][j]
    }
  }
  return dp[0][0]
};
// @lc code=end


// @after-stub-for-debug-begin
module.exports = minimumTotal;
// @after-stub-for-debug-end