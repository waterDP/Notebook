/*
 * @lc app=leetcode.cn id=1706 lang=javascript
 *
 * [1706] 球会落何处
 */

// @lc code=start
/**
 * @param {number[][]} grid
 * @return {number[]}
 */
var findBall = function(grid) {
  const getNextColumn = (row, x) => {
    if (row[x] === 1 && row[x+1] === 1) return x+1
    if (row[x] === -1 && row[x-1] === -1) return x-1
    return -1
  }
  let dp = grid[0].map((x, i) => i)
  for (let row of grid) {
    dp = dp.map(x => getNextColumn(row, x))
  }
  return dp
};
// @lc code=end

