/*
 * @lc app=leetcode.cn id=870 lang=javascript
 *
 * [870] 优势洗牌
 */

// @lc code=start
/**
 * @param {number[]} A
 * @param {number[]} B
 * @return {number[]}
 */
var advantageCount = function (A, B) {
  A.sort((a, b) => a - b)
  let res = []
  for (let i = 0; i < B.length; i++) {
    let isOk = false
    for (let j = 0; j < A.length; j++) {
      if (A[j] > B[i]) {
        isOk = true
        res.push(A.splice(j, 1)[0])
        break
      }
    }
    if (!isOk) {
      res.push(A.splice(0, 1)[0])
    }
  }
  return res
};
// @lc code=end

