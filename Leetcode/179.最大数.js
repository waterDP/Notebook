/*
 * @lc app=leetcode.cn id=179 lang=javascript
 *
 * [179] 最大数
 */

// @lc code=start
/**
 * @param {number[]} nums
 * @return {string}
 */
var largestNumber = function(nums) {
  nums.sort((x, y) => {
    let sx =10, sy =10
    while(sx <= x) {
      sx *= 10
    }
    while(sy <= y) {
      sy *= 10
    }
    return (sx * y + x) - (sy * x + y)
  })
  if (nums[0] === 0) return '0'
  return nums.join('')
};
// @lc code=end

