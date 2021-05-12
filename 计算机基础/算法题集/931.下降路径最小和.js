/*
 * @lc app=leetcode.cn id=931 lang=javascript
 *
 * [931] 下降路径最小和
 */

// @lc code=start
/**
 * @param {number[][]} matrix
 * @return {number}
 */
var minFallingPathSum = function(matrix) {
  const n = matrix.length
  for (let r = n - 2; r >= 0; r--) {
    for (let c = 0; c < n; c++) {
      let best = matrix[r+1][c]
      if (c > 0) {
        best = Math.min(best, matrix[r+1][c-1])
      }
      if (c+1 < n) {
        best = Math.min(best, matrix[r+1][c+1])
      }
      matrix[r][c] += best
    }
  }
  return Math.min(...matrix[0])
};
// @lc code=end

