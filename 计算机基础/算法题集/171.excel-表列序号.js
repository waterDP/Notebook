/*
 * @lc app=leetcode.cn id=171 lang=javascript
 *
 * [171] Excel 表列序号
 */

// @lc code=start
/**
 * @param {string} columnTitle
 * @return {number}
 */
var titleToNumber = function(columnTitle) {
  const n = columnTitle.length
  const base = 'A'.charCodeAt() - 1
  let ret = 0
  for (let i = 0; i < n; i++) {
    const c = columnTitle[i]
    ret += (c.charCodeAt() - base) * Math.pow(26, n-i-1)
  }
  return ret
};
// @lc code=end

