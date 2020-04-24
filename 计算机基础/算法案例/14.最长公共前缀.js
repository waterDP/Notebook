/*
 * @lc app=leetcode.cn id=14 lang=javascript
 *
 * [14] 最长公共前缀
 */

// @lc code=start
/**
 * @param {string[]} strs
 * @return {string}
 */
var longestCommonPrefix = function(strs) {
  if (!strs.length) return ''
  let result = ''
  const [first, ...others] = strs
  for (let i = 0; i < first.length; i++) {
    let flag = others.every(item => item[i] === first[i])
    if (flag) result += first[i]
    else break
  }
  return result
}
// @lc code=end
