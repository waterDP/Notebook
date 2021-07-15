/*
 * @lc app=leetcode.cn id=22 lang=javascript
 *
 * [22] 括号生成
 */

// @lc code=start
/**
 * @param {number} n
 * @return {string[]}
 */
var generateParenthesis = function(n) {
  let ret = []
  const helper = (left, right, current) => {
    if (current.length === n * 2) {
      ret.push(current)
      return 
    }
    if (left < n) {
      helper(left+1, right, current+'(')
    }
    if (left > right) {
      helper(left, right+1, current+')')
    }
  }
  helper(1, 0, '(')
  return ret
};

generateParenthesis(3)
// @lc code=end

