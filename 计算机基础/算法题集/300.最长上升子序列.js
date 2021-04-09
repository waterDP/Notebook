/*
 * @lc app=leetcode.cn id=300 lang=javascript
 *
 * [300] 最长上升子序列
 */

// @lc code=start
/**
 * @param {number[]} nums
 * @return {number}
 */
var lengthOfLIS = function(nums) {
  const length = nums.length
  const dp = new Array(length)
  dp.fill(1)
  let result = 0
  for (let i = 0; i < length; i++) {
    for (let j = 0; j < i; j++) {
      (nums[i] > nums[j]) &&
      (dp[i] = Math.max(dp[i], dp[j] + 1))
    }
    result = Math.max(result, dp[i])
  }

  return result
};
// @lc code=end