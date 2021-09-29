/*
 * @lc app=leetcode.cn id=1738 lang=javascript
 *
 * [1738] 找出第 K 大的异或坐标值
 */

// @lc code=start
/**
 * @param {number[][]} matrix
 * @param {number} k
 * @return {number}
 */
var kthLargestValue = function (matrix, k) {
  const n = matrix.length, m = matrix[0].length
  let pres = new Array(n + 1).fill(0).map(() => new Array(m + 1))
  let result = []
  for (let i = 1; i < n + 1; i++) {
    for (let j = 1; j < m + 1; j++) {
      pres[i][j] = pres[i - 1][j] ^ pres[i][j - 1] ^ pres[i - 1][j - 1] ^ matrix[i - 1][j - 1]
      result.push(pres[i][j])
    }
  }
  result.sort((a, b) => b - a)
  return result[k - 1]
};
// @lc code=end

