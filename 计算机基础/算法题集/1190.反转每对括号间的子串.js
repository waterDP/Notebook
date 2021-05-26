/*
 * @lc app=leetcode.cn id=1190 lang=javascript
 *
 * [1190] 反转每对括号间的子串
 */

// @lc code=start
/**
 * @param {string} s
 * @return {string}
 */
var reverseParentheses = function(s) {
  let str = '', stk = []
  for (const ch of s) {
    if (ch === '(') {
      stk.push(str)
      str = ''
    } else if (ch === ')') {
      str = str.split('').reverse().join('')
      str = stk[stk.length - 1] + str
      stk.pop()
    } else {
      str += ch
    }
  }
  return str
};
// @lc code=end

