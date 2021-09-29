/*
 * @lc app=leetcode.cn id=1678 lang=javascript
 *
 * [1678] 设计 Goal 解析器
 */

// @lc code=start
/**
 * @param {string} command
 * @return {string}
 */
var interpret = function(command) {
  let n = command.length, i = 0, ret = ''
  while (i < n) {
    if (command[i] === 'G') {
      ret += 'G'
      i += 1
    } else if (command[i+1] == ')') {
      ret += 'o'
      i += 2
    } else {
      ret += 'al'
      i += 4
    }
  }

  return ret
};
// @lc code=end

