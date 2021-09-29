/*
 * @lc app=leetcode.cn id=1839 lang=javascript
 *
 * [1839] 所有元音按顺序排布的最长子字符串
 */

// @lc code=start
/**
 * ! 状态机
 * @param {string} word
 * @return {number}
 */
var longestBeautifulSubstring = function(word) {
  const transit = new Set([
    'ae', 'ei', 'io', 'ou', 
    'aa', 'ee', 'ii', 'oo', 'uu',
    'xa', 'ea', 'ia', 'oa', 'ua'
  ])
  let status = 'x'
  let cur = 0
  let ans = 0

  for (const char of word) {
    if (transit.has(status+char)) {
      if (status != 'a' && char == 'a') {
        cur = 1
      } else {
        cur++
      }
      status = char
    } else {
      status = 'x'
      cur = 0
    }
    if (status === 'u') {
      ans = Math.max(ans, cur)
    }
  }
  return ans
};
// @lc code=end

