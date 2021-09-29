/*
 * @lc app=leetcode.cn id=495 lang=javascript
 *
 * [495] 提莫攻击
 */

// @lc code=start
/**
 * @param {number[]} timeSeries
 * @param {number} duration
 * @return {number}
 */
var findPoisonedDuration = function(timeSeries, duration) {
  const n = timeSeries.length
  if (n === 0) return 0
  let total = 0
  for (let i = 0; i < n-1; i++) {
    total += Math.min(timeSeries[i+1] - timeSeries[i], duration)    
  }
  return total + duration
};
// @lc code=end

