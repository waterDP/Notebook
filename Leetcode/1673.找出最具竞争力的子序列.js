/*
 * @lc app=leetcode.cn id=1673 lang=javascript
 *
 * [1673] 找出最具竞争力的子序列
 */

// @lc code=start
/**
 * @param {number[]} nums
 * @param {number} k
 * @return {number[]}
 */
var mostCompetitive = function (nums, k) {
  const len = nums.length
  if (k === len) return nums
  const ret = new Array(k)
  let p = len - k
  const stack = []
  for (let i = 0; i < len; i++) {
    while (stack.length && p > 0 && nums[i] < nums[stack[stack.length - 1]]) {
      stack.pop()
      p--
    }
    stack.push(i)
  }
  for (let i = 0; i < p; i++) {
    stack.pop()
  }
  let j = k - 1
  while(stack.length) {
    ret[j--] = nums[stack.pop()]
  }
  return ret
};
// @lc code=end

