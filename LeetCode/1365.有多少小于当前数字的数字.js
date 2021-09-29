/*
 * @lc app=leetcode.cn id=1365 lang=javascript
 *
 * [1365] 有多少小于当前数字的数字
 */

// @lc code=start
/**
 * todo 计数排序
 * @param {number[]} nums
 * @return {number[]}
 */
var smallerNumbersThanCurrent = function(nums) {
  const cnt = new Array(101).fill(0)
  const len = nums.length
  for (let i = 0; i < len; i++) {
    cnt[nums[i]] += 1
  }
  for (let i = 1; i < 100; i++) {
    cnt[i] += cnt[i-1]
  }
  let result = []
  for (let i = 0; i < len; i++) {
    // ? 为什么要判断
    result.push(nums[i] ? cnt[nums[i] - 1] : 0)
  }
  return result
};
// @lc code=end

