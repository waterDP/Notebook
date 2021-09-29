/*
 * @lc app=leetcode.cn id=168 lang=javascript
 *
 * [168] Excel表列名称
 */

// @lc code=start
/**
 * @param {number} n
 * @return {string}
 */
var convertToTitle = function(n) {
  if(n <= 0) return ''
  let res = []
  while(n) {
      n--
      let remain = n % 26
      res.unshift(String.fromCharCode(remain + 65))
      n = Math.floor(n / 26)
  }
  return res.join("")
};
// @after-stub-for-debug-begin
// @after-stub-for-debug-begin
module.exports = convertToTitle;
// @after-stub-for-debug-end