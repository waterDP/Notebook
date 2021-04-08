/*
 * @lc app=leetcode.cn id=153 lang=javascript
 *
 * [153] 寻找旋转排序数组中的最小值
 */

// @lc code=start
/**
 * @param {number[]} nums
 * @return {number}
 */
var findMin = function(nums) {
  let low = 0
  let high = nums.length - 1
  while(low < high) {
    const pivot = Math.floor((low+high)/2)
    if (nums[pivot] > nums[high]) {
      low = pivot + 1
    } else {
      high = pivot
    }
  }

  return nums[low]
};
// @lc code=end

