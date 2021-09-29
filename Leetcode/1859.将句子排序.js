/*
 * @lc app=leetcode.cn id=1859 lang=javascript
 *
 * [1859] 将句子排序
 */

// @lc code=start
/**
 * @param {string} s
 * @return {string}
 */
var sortSentence = function(s) {
  let arr = s.split(' ')
  let res = [] 
  for (let a of arr) {
    const n = a.length
    res[a[n-1]] = a.slice(0, n-1)
  }
  return res.slice(1).join(' ')
};
// @lc code=end

