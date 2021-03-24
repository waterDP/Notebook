/*
 * @lc app=leetcode.cn id=456 lang=javascript
 *
 * [456] 132模式
 */

// @lc code=start
/**
 * @param {number[]} nums
 * @return {boolean}
 */
var find132pattern = function (nums) {
  let minIdx = 0, len = nums.length, stack = []
  while (minIdx < len) {
    stack = [];
    for (let i = minIdx; i < len; i++) {
      if (!stack.length) stack[0] = nums[i]
      if (nums[i] > stack[0] && stack.length === 1) stack[1] = nums[i]
      if (nums[i] > stack[1] && stack.length === 2 && i !== len - 1) stack[1] = nums[i]
      if (nums[i] > stack[0] && nums[i] < stack[1]) return true
      if (minIdx === len - 2) return false
    }
    minIdx++
  }
  return false
}
// @lc code=end

