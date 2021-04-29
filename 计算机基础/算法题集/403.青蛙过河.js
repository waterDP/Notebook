/*
 * @lc app=leetcode.cn id=403 lang=javascript
 *
 * [403] 青蛙过河
 */

// @lc code=start
/**
 * @param {number[]} stones
 * @return {boolean}
 */
var canCross = function (stones) {
  const n = stones.length
  const dp = new Array(n).fill(0).map(() => new Array(n).fill(0))
  dp[0][0] = true
  for (let i = 1; i < n; ++i) {
    if (stones[i] - stones[i-1] > i) {
      return false
    }
  }
  for (let i = 1; i < n; i++) {
    for (let j = i-1; j >= 0; j--) {
      const k = stones[i] - stones[j]
      if (k > j+ 1) {
        break
      }
      dp[i][k] = dp[j][k-1]||dp[j][k]||dp[j][k+1]
      if (i === n-1 && dp[i][k]) {
        return true
      }
    }
  }
  return false
};
// @lc code=end

