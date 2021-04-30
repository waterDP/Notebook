/*
 * @lc app=leetcode.cn id=137 lang=javascript
 *
 * [137] 只出现一次的数字 II
 */

// @lc code=start
/**
 * @param {number[]} nums
 * @return {number}
 */
var singleNumber = function (nums) {
  const freq = new Map();
  for (const num of nums) {
    freq.set(num, (freq.get(num) || 0) + 1);
  }
  let ans = 0;
  for (const [num, occ] of freq.entries()) {
    if (occ === 1) {
      ans = num;
      break;
    }
  }
  return ans
};
// @lc code=end

