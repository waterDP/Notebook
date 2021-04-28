/*
 * @lc app=leetcode.cn id=463 lang=javascript
 *
 * [463] 岛屿的周长
 */

// @lc code=start
/**
 * @param {number[][]} grid
 * @return {number}
 */
var islandPerimeter = function (grid) {
  const m = grid.length, n = grid[0].length
  let ans = 0
  const dx = [1, 0, -1, 0]
  const dy = [0, 1, 0, -1]
  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      if (grid[i][j]) {
        let cnt = 0
        // 向四个方向上搜索，如果下一个出界或下一个是水域即为0，则周长加一
        for (let k = 0; k < 4; k++) {
          let tx = i + dx[k]
          let ty = j + dy[k]
          if (tx < 0 || tx >= m || ty < 0 || ty >= n || !grid[tx][ty]) {
            cnt++
          }
        }
        ans += cnt
      }
    }
  }
  return ans
};
// @lc code=end

