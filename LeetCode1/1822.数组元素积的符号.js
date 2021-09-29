/*
 * @lc app=leetcode.cn id=1822 lang=javascript
 *
 * [1822] 数组元素积的符号
 */

// @lc code=start
/**
 * @param {number[]} nums
 * @return {number}
 */
var arraySign = function(nums) {
  let diff = false
  for (let n of nums) {
    if (n === 0) {
      return 0
    }
    if (n < 0) {
      diff = !diff
    }
  }
  return diff ? -1 : 1
};
// @lc code=end

