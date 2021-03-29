/*
 * @lc app=leetcode.cn id=343 lang=javascript
 *
 * [343] 整数拆分
 */

// @lc code=start
/**
 * @param {number} n
 * @return {number}
 */
var integerBreak = function(n) {
  let dp = []
  for (let i = 0; i <= n; i++) {
    let max = 0
    for (let j = 1; j < i; j++) {
      max = Math.max(max, Math.max(j * (i-j), j * dp[i - j]))
    }
    dp[i] = max
  }
  return dp[n]
};
// @lc code=end

