/*
 * @lc app=leetcode.cn id=66 lang=javascript
 *
 * [66] 加一
 */

// @lc code=start
/**
 * @param {number[]} digits
 * @return {number[]}
 */
var plusOne = function(digits) {
  // 非[9,9,9,...]情况
  for (let i = digits.length - 1; i >= 0; i--) {
    digits[i]++
    digits[i] = digits[i] % 10
    if (digits[i] != 0) return digits
  }

  // [9, 9, 9...]情况
  digits = new Array(digits.length + 1).fill(0)
  digits[0] = 1
  return digits
};

plusOne([9,9])
// @lc code=end

