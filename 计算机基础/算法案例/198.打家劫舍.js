/*
 * @lc app=leetcode.cn id=198 lang=javascript
 *
 * [198] 打家劫舍
 */

// @lc code=start
/**
 * @param {number[]} nums
 * @return {number}
 */
var rob = function(nums) {
  if (nums.length === 0) return 0
  if (nums.length === 1) return nums[0]
  if (nums.length === 2) return Math.max(nums[0], nums[1])
  if (nums.length === 3) return Math.max(nums[0]+nums[2], nums[1])
  let dp = [nums[0], Math.max(nums[0], nums[1]), Math.max(nums[0] + nums[2], nums[1])]
  for (let i = 3; i < nums.length; i++) {
    dp[i] = Math.max(dp[i-1], dp[i-2]+nums[i])
  }
  return Math.max(dp[nums.length-1], dp[nums.length-2])
};
// @lc code=end

