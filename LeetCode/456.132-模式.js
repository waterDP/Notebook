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
  let n = nums.length
  if (n < 3) return false
  let stack = [nums[n - 1]]
  let last = -Infinity
  for (let i = n - 2; i >= 0; i--) {
    let cur = nums[i]
    if (cur < last) return true
    while (stack.length && cur > stack[stack.length - 1]) {
      last = stack.pop()
    }
    if (cur > last) stack.push(cur)
  }
  return false
}
// @lc code=end

