/*
 * @lc app=leetcode.cn id=1905 lang=javascript
 *
 * [1905] 统计子岛屿
 */

// @lc code=start
/**
 * @param {number[][]} grid1
 * @param {number[][]} grid2
 * @return {number}
 */
var countSubIslands = function(grid1, grid2) {
  let m = grid2.length, n = grid2[0].length

  const bfs = (i, j) => {
    const queue = [[i, j]]
    grid2[i][j] = 0
    let check = (grid1[i][j] == 1)

    while (queue.length) {
      const [x1, y1] = queue.shift()

      for (let [nx, ny] of [[x1-1, y1], [x1+1, y1], [x1, y1-1], [x1, y1+1]]) {
        if (nx >= 0 && nx < m && ny >= 0 && ny < n && grid2[nx][ny] === 1) {
          queue.push([nx, ny])
          grid2[nx][ny] = 0
          if (grid1[nx][ny] !== 1) {
            check = false
          }
        }
      }
    }
    return check ? 1 : 0
  }

  let ret = 0
  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      if (grid2[i][j] === 1) {
        ret += bfs(i, j)
      } 
    }
  }
  return ret
};
// @lc code=end

