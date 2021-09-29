/*
 * @lc app=leetcode.cn id=674 lang=javascript
 *
 * [674] 最长连续递增序列
 */

// @lc code=start
/**
 * @param {number[]} nums
 * @return {number}
 */
var findLengthOfLCIS = function(nums) {
  let max = 0, 
    currentValue = Number.MIN_SAFE_INTEGER, 
    currentLength = 0
  for (let num of nums) {
    if (num > currentValue) {
      currentLength ++
    } else {
      currentLength = 1
    }
    max = Math.max(max, currentLength)
    currentValue = num
  }
  return max
};
// @lc code=end

