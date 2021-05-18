/*
 * @lc app=leetcode.cn id=274 lang=javascript
 *
 * [274] H 指数
 */

// @lc code=start
/**
 * @param {number[]} citations
 * @return {number}
 */
var hIndex = function(citations) {
  const n = citations.length
  const papers = new Array(n+1).fill(0)
  for (let c of citations) {
    papers[Math.min(c, n)]++
  }
  let k = n
  for (let s = papers[n]; k > s; s += papers[k]) {
    k--
  }
  return k
}
// @lc code=end

