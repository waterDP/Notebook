/*
 * @lc app=leetcode.cn id=567 lang=javascript
 *
 * [567] 字符串的排列
 */

// @lc code=start
/**
 * @param {string} s1
 * @param {string} s2
 * @return {boolean}
 */
var checkInclusion = function(s1, s2) {
  const n = s1.length, m = s2.length
  if (n > m) return false
  const cnt1 = new Array(26).fill(0)
  const cnt2 = new Array(26).fill(0)
  for (let i = 0; i < n; i++) {
    ++cnt1[s1[i].charCodeAt() - 'a'.charCodeAt()]
    ++cnt2[s2[i].charCodeAt() - 'a'.charCodeAt()]
  }
  if (cnt1.toString() === cnt2.toString()) {
    return true
  }
  for (let i = n; i < m; i++) {
    ++cnt2[s2[i].charCodeAt() - 'a'.charCodeAt()]
    --cnt2[s2[i-n].charCodeAt() - 'a'.charCodeAt()]
    if (cnt1.toString() === cnt2.toString()) {
      return true
    }
  }
  return false
};
// @lc code=end

