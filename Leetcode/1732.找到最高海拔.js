/*
 * @lc app=leetcode.cn id=1732 lang=javascript
 *
 * [1732] 找到最高海拔
 */

// @lc code=start
/**
 * @param {number[]} gain
 * @return {number}
 */
var largestAltitude = function(gain) {
  let curr = 0, max = 0
  for (let g of gain) {
    curr += g
    curr > max && (max = curr)
  }
  return max
};
// @lc code=end

