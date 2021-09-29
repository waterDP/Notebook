/*
 * @lc app=leetcode.cn id=661 lang=javascript
 *
 * [661] 图片平滑器
 */

// @lc code=start
/**
 * @param {number[][]} M
 * @return {number[][]}
 */
var imageSmoother = function(M) {
  let m = M.length, n = M[0].length
  let ans = new Array(m).fill(0).map(() => new Array(n).fill(0))
  for (let r = 0; r < m; r++) {
    for (let c = 0; c < n; c++) {
      let count = 0
      for (let nr = r - 1; nr <= r + 1; nr++) {
        for (let nc = c - 1; nc <= c + 1; nc++) {
          if (nr >= 0 && nr < m && nc >= 0 && nc < n) {
            ans[r][c] += M[nr][nc]
            count++
          }
        }
      }
      ans[r][c] = Math.floor(ans[r][c]/count)
    }
  }
  return ans
};
// @lc code=end