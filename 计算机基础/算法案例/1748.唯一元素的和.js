/*
 * @lc app=leetcode.cn id=1748 lang=javascript
 *
 * [1748] 唯一元素的和
 */

// @lc code=start
/**
 * @param {number[]} nums
 * @return {number}
 */
var sumOfUnique = function(nums) {
  let map = {}
  for (let item of nums) {
    map[item] ? map[item]++ : (map[item] = 1)
  }
  let result = 0
  for (let item of nums) {
    if (map[item] === 1) {
      result += item
    }
  }
  return result
};
// @lc code=end

