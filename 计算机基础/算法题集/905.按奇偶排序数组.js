/*
 * @lc app=leetcode.cn id=905 lang=javascript
 *
 * [905] 按奇偶排序数组
 */

// @lc code=start
/**
 * @param {number[]} nums
 * @return {number[]}
 */
var sortArrayByParity = function(nums) {
  let f = 0
  for (let i = 0; i < nums.length; i++) {
    if (nums[i] % 2 === 0) {
      [nums[f], nums[i]] = [nums[i], nums[f]]
      f++
    }
  }
  return nums
};
// @lc code=end

