/*
 * @lc app=leetcode.cn id=363 lang=javascript
 *
 * [363] 矩形区域不超过 K 的最大数值和
 */

// @lc code=start
/**
 * @param {number[][]} matrix
 * @param {number} k
 * @return {number}
 */
var maxSumSubmatrix = function (matrix, k) {
  let rowLen = matrix.length
  let colLen = matrix[0].length
  let b = new Array(colLen)
  let ret = -Number.MAX_VALUE

  for (let i = 0; i < rowLen; i++) {
    b.fill(0)
    for (let j = i; j < rowLen;  j++) {
      for (let k = 0; k < colLen; k++) b[k] += matrix[j][k]

      for (let m=0; m < b.length; m++) {
        let sum = 0
        for (let n = m; n <b.length; n++) {
          sum += b[n]
          if (sum <= k && sum > ret) {
            ret = sum
          }
        }
      }
    }
  }
  return ret
};
// @lc code=end

