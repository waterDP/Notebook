/*
 * @lc app=leetcode.cn id=1091 lang=javascript
 *
 * [1091] 二进制矩阵中的最短路径
 */

// @lc code=start
/**
 * @param {number[][]} grid
 * @return {number}
 */
var shortestPathBinaryMatrix = function(grid) {
  if (grid[0][0]) return -1
  const row = grid.length -  1, col = grid[0].length - 1
  if (grid[row][col]) return -1
  const dirs = [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]]
  const queue = [[0, 0]]
  grid[0][0] = 1
  let res = 0, i = queue.length
  while(i) {
    res++
    while(i--) {
      const temp = queue.shift()
      if (temp[0] === row && temp[1] === col) {
        return res
      }
      dirs.forEach(dir => {
        const newX = temp[0] + dir[0]
        const newY = temp[1] + dir[1]
        if (newX < 0 || newX > row || newY < 0 || newY > col || grid[newX][newY]) return
        queue.push([newX, newY])
        grid[newX][newY] = 1
      })
    }
    i = queue.length
  }
  return -1
};
// @lc code=end

