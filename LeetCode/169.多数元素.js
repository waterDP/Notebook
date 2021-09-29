/*
 * @lc app=leetcode.cn id=169 lang=javascript
 *
 * [169] 多数元素
 */

// @lc code=start
/**
 * todo Boyer-Moor投票算法
 * @param {number[]} nums
 * @return {number}
 */
var majorityElement = function(nums) {
  let count = 0, candidate
  for (let n of nums) {
    if (count === 0) {
      candidate = n
    }
    count += (n === candidate) ? 1 : -1
  }
  return candidate
};
// @lc code=end

