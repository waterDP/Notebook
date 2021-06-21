/*
 * @lc app=leetcode.cn id=36 lang=javascript
 *
 * [36] 有效的数独
 */

// @lc code=start
/**
 * @param {character[][]} board
 * @return {boolean}
 */
var isValidSudoku = function(board) {
  const set = new Set()

  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      const number = board[i][j]
      if (number === '.') continue
      const colStr = `${number}c${i}`
      const rowStr = `${number}r${j}`
      const sectionStr = `${number}s(${Math.floor(i/3)}, ${Math.floor(j/3)})`

      if (set.has(colStr) || set.has(rowStr) || set.has(sectionStr)) {
        return false
      }
      set.add(colStr)
      set.add(rowStr)
      set.add(sectionStr)
    }
  }
  return true
};
// @lc code=end

