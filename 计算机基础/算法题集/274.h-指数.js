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
  // 一开始是最大，即所有论文都满足
  // 如果不满足就减少K, 然后加上现在新的满足k的论文数量，再进行比较
  for (let s = papers[n]; k > s; s += papers[k]) {
    k--
  }
  return k
}
// @lc code=end

