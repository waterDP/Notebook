/*
 * @lc app=leetcode.cn id=1877 lang=javascript
 *
 * [1877] 数组中最大数对和的最小值
 */

// @lc code=start
/**
 * @param {number[]} nums
 * @return {number}
 */
var minPairSum = function(nums) {
  nums.sort((a, b) => a - b)
  let l = 0, r = nums.length - 1
  let max = Number.MIN_SAFE_INTEGER
  while (l < r) {
    max = Math.max(max, nums[l]+nums[r])
    l++
    r--
  }
  return max
};
// @lc code=end

