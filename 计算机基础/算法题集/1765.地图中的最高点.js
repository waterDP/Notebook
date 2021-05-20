/*
 * @lc app=leetcode.cn id=1765 lang=javascript
 *
 * [1765] 地图中的最高点
 */

// @lc code=start
/**
 * @param {number[][]} isWater
 * @return {number[][]}
 */
var highestPeak = function (isWater) {
  const m = isWater.length, n = isWater[0].length
  const ans = new Array(m).fill(0).map(() => new Array(n).fill(Infinity))
  const dirs = [[1, 0], [-1, 0], [0, 1], [0, -1]]
  const queue = []
  const visited = new Array(m).fill(0).map(() => new Array(n).fill(false))
  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      if (isWater[i][j] == 1) {
        queue.push([i, j])
        visited[i][j] = true
      }
    }
  }
  let height = 0
  while(queue.length) {
    const remove = queue.slice()
    queue.length = 0
    for (let i = 0; i < remove.length; i++) {
      const [row, col] = remove[i]
      ans[row][col] = height
      for (const [dx, dy] of dirs) {
        const x = row + dx
        const y = col + dy
        if (x >= 0 && x < m && y >= 0 && y < n && !visited[x][y]) {
          queue.push([x, y])
          visited[x][y] = true
        }
      }
    }
    height++
  }
  return ans
};
// @lc code=end

