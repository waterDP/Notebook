/*
 * @lc app=leetcode.cn id=75 lang=javascript
 *
 * [75] 颜色分类
 */

// @lc code=start
/**
 * @param {number[]} nums
 * @return {void} Do not return anything, modify nums in-place instead.
 */
var sortColors = function(nums) {
  let length = nums.length
  let p1 = p0 = 0
  for (let i = 0; i < length; i++) {
    if (nums[i] === 1) {
      [nums[p1], nums[i]] = [nums[i], [nums[p1]]]
      p1++
    } else if (nums[i] === 0) {
      [nums[p0], nums[i]] = [nums[i], nums[p0]]
      if (p0 < p1) {
        [nums[p1], nums[i]] = [nums[i], nums[p1]]
      }
      p0++
      p1++
    }
  }
  return nums
};

// @lc code=end

