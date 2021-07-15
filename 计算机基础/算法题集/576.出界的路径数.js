/*
 * @lc app=leetcode.cn id=576 lang=javascript
 *
 * [576] 出界的路径数
 */

// @lc code=start
/**
 * @param {number} m
 * @param {number} n
 * @param {number} maxMove
 * @param {number} startRow
 * @param {number} startColumn
 * @return {number}
 */
var findPaths = function (m, n, maxMove, startRow, startColumn) {
  const helper = (i, j, N) => {
    if (N < 0) {
      return 0
    }
    if (i < 0 || i >= m || j < 0 || j >= n) {
      return 1
    }
    const key = `${i}-${j}-${N}`
    if (visited.has(key)) {
      return visited.get(key)
    }
    let res = 0
    for (let k = 0; k < 4; k++) {
      res = (res + helper(i + direction[k][0], j + direction[k][1], N - 1)) % mod
    }
    visited.set(key, res)
    return res
  }
  const mod = Math.pow(10, 9) + 7
  const direction = [[1, 0], [-1, 0], [0, -1], [0, 1]]
  const visited = new Map()
  return helper(startRow, startColumn, maxMove)
};
// @lc code=end