/*
 * @lc app=leetcode.cn id=396 lang=javascript
 *
 * [396] 旋转函数
 */

// @lc code=start
/**
 * @param {number[]} nums
 * @return {number}
 */
var maxRotateFunction = function(nums) {
  const n = nums.length
  let cur = 0, sum = 0
  for (let i = 0; i < n; i++) {
    cur += nums[i] * i
    sum += nums[i]
  }
  let res = cur
  for (let i = n-1; i > 0; i--) {
    cur += sum
    cur -= nums[i] * n
    res = Math.max(cur, res)
  }
  return res
}
// @lc code=end

