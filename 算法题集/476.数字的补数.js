/*
 * @lc app=leetcode.cn id=476 lang=javascript
 *
 * [476] 数字的补数
 */

// @lc code=start
/**
 * @param {number} num
 * @return {number}
 */
var findComplement = function(num) {
  let tmp = 1
  while (tmp < num) {
    tmp <<= 1
    tmp += 1
  }
  return tmp^num
};
// @lc code=end

