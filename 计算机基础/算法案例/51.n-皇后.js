/*
 * @lc app=leetcode.cn id=51 lang=javascript
 *
 * [51] N 皇后
 */

// @lc code=start
/**
 * @param {number} n
 * @return {string[][]}
 */
var solveNQueens = function(n) {
  const board = new Array(n)
  for (let i = 0; i < n; i++) {
    board[i] = new Array(n).fill('.')
  }

  const cols = new Set() // 列集，记录出现过皇后的列
  const diag1 = new Set() // 正对角线集
  const diag2 = new Set() // 反对角线集
  const res = []

  const helper = row => {
    if (row === n) {
      const stringsBoard = board.slice()
      for (let i = 0; i < n; i++) {
        stringsBoard[i] = stringsBoard[i].join('')
      }
      res.push(stringsBoard)
      return
    }
    for (let col = 0; col < n; col++) {
      // 如果当前点所在列，所在的对角线都没有皇后，即可选择，否则，跳过
      if (!cols.has(col) && !diag1.has(row+col) && !diag2.has(row - col)) {
        board[row][col] = 'Q' // 放置皇后
        cols.add(col)         // 记录放了皇后的列
        diag1.add(row + col)  // 记录放了皇后的正对角线
        diag2.add(row - col)  // 记录放了皇后的负对角线

        helper(row+1)
        
        board[row][col] = '.'
        cols.delete(col)
        diag1.delete(row + col)
        diag2.delete(row - col)
      }
    }
  }

  helper(0)
  return res
};
// @lc code=end

