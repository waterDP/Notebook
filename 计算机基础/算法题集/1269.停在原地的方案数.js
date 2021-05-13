/*
 * @lc app=leetcode.cn id=1269 lang=javascript
 *
 * [1269] 停在原地的方案数
 */

// @lc code=start
/**
 * @param {number} steps
 * @param {number} arrLen
 * @return {number}
 */
var numWays = function (steps, arrLen) {
  const MODULO = 1000000007
  const maxColumn = Math.min(arrLen - 1, Math.ceil(steps/2))
  let dp = new Array(steps+1).fill(0).map(() => new Array(maxColumn + 1).fill(0))
  dp[0][0] = 1
  for (let i = 1; i <= steps; i++) {
    for (let j = 0; j <= maxColumn; j++) {
      dp[i][j] = dp[i - 1][j]
      if (j - 1 >= 0) {
        dp[i][j] = (dp[i][j] + dp[i - 1][j - 1]) % MODULO
      }
      if (j + 1 <= maxColumn) {
        dp[i][j] = (dp[i][j] + dp[i - 1][j + 1]) % MODULO
      }
    }
  }
  return dp[steps][0]
};
// @lc code=end

