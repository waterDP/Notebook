/*
 * @lc app=leetcode.cn id=392 lang=javascript
 *
 * [392] 判断子序列
 */

// @lc code=start
/**
 * @param {string} s
 * @param {string} t
 * @return {boolean}
 */
var isSubsequence = function(s, t) {
  const n = s.length, m = t.length
  let i =0, j = 0
  while (i < n && j < m) {
    if (s[i] === t[j]) {
      i++
    }
    j++
  }
  return i === n
};
// @lc code=end

