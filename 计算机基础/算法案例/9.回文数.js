/*
 * @lc app=leetcode.cn id=9 lang=javascript
 *
 * [9] 回文数
 */

// @lc code=start
/**
 * @param {number} x
 * @return {boolean}
 */
var isPalindrome = function(x) {
  if (x < 0) return false
  let flag = true
  x = x.toString()
  for (let i = 0, len = x.length; i < len/2; i++) {
    if (x[i] !== x[len-1-i]) {
      flag = false
      break
    }
  }
  return flag
};
// @lc code=end

