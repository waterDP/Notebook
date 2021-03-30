/*
 * @lc app=leetcode.cn id=74 lang=javascript
 *
 * [74] 搜索二维矩阵
 */

// @lc code=start
/**
 * @param {number[][]} matrix
 * @param {number} target
 * @return {boolean}
 */
var searchMatrix = function(matrix, target) {
  const rows = matrix.length
  const cols = matrix[0].length
  let rowIndex = 0

  while(matrix[rowIndex] && matrix[rowIndex][0] <= target) {
    rowIndex++
  }

  rowIndex && rowIndex--

  const targetRow = matrix[rowIndex]

  const dichotomy = (arr, left, right) => {
    while (left <= right) {
      let mid = left + Math.floor((right - left) / 2)
      if (arr[mid] === target) {
        return true
      }
      if (arr[mid] < target) {
        left = mid + 1
      } else {
        right = mid - 1
      }
    }
    return false
  }

  return dichotomy(targetRow, 0, cols)
};
// @lc code=end

