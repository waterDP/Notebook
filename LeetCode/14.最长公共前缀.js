/*
 * @lc app=leetcode.cn id=14 lang=javascript
 *
 * [14] 最长公共前缀
 */

// @lc code=start
/**
 * 纵向扫描
 * @param {string[]} strs
 * @return {string}
 */
var longestCommonPrefix = function(strs) {
  if (strs === null || strs.length === 0) {
    return ''
  }
  let length = strs[0].length
  let count = strs.length
  for (let i = 0; i < length; i++) {
    let c = strs[0][i]
    for (let j = 1; j < count; j++) {
      if (i === strs[j].length || strs[j][i] !== c) {
        return strs[0].substring(0, i)
      }
    }
  }
  return strs[0]
}
// @lc code=end
