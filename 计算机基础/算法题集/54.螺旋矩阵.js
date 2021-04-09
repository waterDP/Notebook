/*
 * @lc app=leetcode.cn id=54 lang=javascript
 *
 * [54] 螺旋矩阵
 */

// @lc code=start
/**
 * @param {number[][]} matrix
 * @return {number[]}
 */
var spiralOrder = function(matrix) {
  let h = matrix.length, w = matrix[0].length
  let total = h * w, current = 0
  let moves = [[0, 1], [1, 0], [0, -1], [-1, 0]] 
  let moveStrategyIndex = 0
  let result = []

  let visited = new Array(h)
  for (let i = 0; i < h; i++) {
    visited[i] = new Array(w).fill(false)
  }

  function track([i, j]) {
    if (current === total) {
      return
    }

    result.push(matrix[i][j])
    visited[i][j] = true
    current++

    let nextState = moves[moveStrategyIndex]
    let [newi, newj] = [i+nextState[0], j+nextState[1]]
    if (newi < 0 || newi >= h || newj < 0 || newj >= w || visited[newi][newj]) {
      moveStrategyIndex = (moveStrategyIndex + 1) % 4
      nextState = moves[moveStrategyIndex];
      [newi, newj] = [i + nextState[0], j + nextState[1]]
    }
    track([newi, newj])
  }

  track([0, 0])

  return result
};



// @lc code=end

