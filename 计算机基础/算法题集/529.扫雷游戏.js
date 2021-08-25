/*
 * @lc app=leetcode.cn id=529 lang=javascript
 *
 * [529] 扫雷游戏
 */

// @lc code=start
/**
 * @param {character[][]} board
 * @param {number[]} click
 * @return {character[][]}
 */
var updateBoard = function(board, click) {
  const dirX = [0, 1, 0, -1, 1, 1, -1, -1]
  const dirY = [1, 0, -1, 0, 1, -1, 1, -1]
  const m = board.length, n = board[0].length

  const bfs = (sx, sy) => {
    const queue = []
    const visited = new Array(m).fill(0).map(() => [])
    queue.push([sx, sy])
    visited[sx][sy] = true
    while (queue.length) {
      let pos = queue.shift()
      let cnt = 0, [x, y] = pos
      for (let i = 0; i < 8; i++) {
        let tx = x + dirX[i]
        let ty = y + dirY[i]
        if (tx < 0 || tx >= m || ty < 0 || ty >= n) {
          continue
        }
        if (board[tx][ty] === 'M') {
          ++cnt
        }
      }
      if (cnt > 0) {
        // 规则3 统计周围地雷数据
        board[x][y] = cnt.toString()
      } else {
        // 规则2 
        board[x][y] = 'B'
        for (let i = 0; i < 8; i++) {
          const tx = x + dirX[i]
          const ty = y + dirY[i]
          if (tx < 0 || tx >= m || ty < 0 || ty >= n || board[tx][ty] != 'E' || visited[tx][ty]) {
            continue
          }
          queue.push([tx, ty])
          visited[tx][ty] = true
        }
      }
    }
  }

  let [x, y] = click
  if (board[x][y] === 'M') {
    // 规则1，被干死
    board[x][y] = 'X'
  } else {
    bfs(x, y)
  }
  return board
};
// @lc code=end

