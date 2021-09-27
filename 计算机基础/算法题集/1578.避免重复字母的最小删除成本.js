/*
 * @lc app=leetcode.cn id=1578 lang=javascript
 *
 * [1578] 避免重复字母的最小删除成本
 */

// @lc code=start
/**
 * @param {any} s
 * @param {number[]} cost
 * @return {number}
 */
var minCost = function(s, cost) {
  let ret = 0
  let i = 0, len = s.length
  while (i < len) {
    const char = s[i]
    let maxValue = 0
    let sum = 0
    while (i < len && s[i] === char) {
      maxValue = Math.max(maxValue, cost[i])
      sum += cost[i]
      i++
    }
    ret += (sum - maxValue)
  }
  return ret
};
// @lc code=end

