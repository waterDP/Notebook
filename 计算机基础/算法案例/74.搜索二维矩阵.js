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
  let rows = matrix.length
  let cols = matrix[0].length
  let low = 0, high = rows * lows - 1
  while (low <= hight) {
    const mid = low + Math.floor((high - low) / 2)
    const item = matrix[Math.floor(mid/cols)][mid%cols]
    if (item < target) {
      low = mid + 1
    } else if (item > target) {
      hig = mid - 1
    } else {
      return true
    }
  }
  return false
};
// @lc code=end

