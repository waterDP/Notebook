/*
 * @lc app=leetcode.cn id=1337 lang=javascript
 *
 * [1337] 矩阵中战斗力最弱的 K 行
 */

// @lc code=start
/**
 * @param {number[][]} mat
 * @param {number} k
 * @return {number[]}
 */
var kWeakestRows = function(mat, k) {
  let n = mat.length, m = mat[0].length
  let power = []
  for (let i = 0; i < n; i++) {
    power.push([i, 0])
    for (let j = 0; j < m; j++) {
      power[i][1] += mat[i][j]
    }
  }
  power.sort((a, b) => a[1] - b[1])
  const ret = []
  for (let i = 0; i < k; i++) {
    ret.push(power[i][0])
  }
  return ret
};
// @lc code=end

