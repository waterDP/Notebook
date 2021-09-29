/*
 * @lc app=leetcode.cn id=119 lang=javascript
 *
 * [119] 杨辉三角 II
 */

// @lc code=start
/**
 * @param {number} rowIndex
 * @return {number[]}
 */
var getRow = function(rowIndex) {
  const row = new Array(rowIndex+1).fill(0)
  row[0] = 1
  for (let i = 1; i < rowIndex+1; i++) {
    for (let j = i; j > 0; --j) {
      row[j] += row[j-1]
    }
  }
  return row
};
// @lc code=end

