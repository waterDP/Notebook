/*
 * @Author: water.li
 * @Date: 2022-09-18 22:28:06
 * @Description: 
 * @FilePath: \note\LeetCode\542.01-矩阵.js
 */
/*
 * @lc app=leetcode.cn id=542 lang=javascript
 *
 * [542] 01 矩阵
 *
 * https://leetcode.cn/problems/01-matrix/description/
 *
 * algorithms
 * Medium (46.36%)
 * Likes:    758
 * Dislikes: 0
 * Total Accepted:    116K
 * Total Submissions: 250.2K
 * Testcase Example:  '[[0,0,0],[0,1,0],[0,0,0]]'
 *
 * 给定一个由 0 和 1 组成的矩阵 mat ，请输出一个大小相同的矩阵，其中每一个格子是 mat 中对应位置元素到最近的 0 的距离。
 * 
 * 两个相邻元素间的距离为 1 。
 * 
 * 
 * 
 * 示例 1：
 * 
 * 
 * 
 * 
 * 输入：mat = [[0,0,0],[0,1,0],[0,0,0]]
 * 输出：[[0,0,0],[0,1,0],[0,0,0]]
 * 
 * 
 * 示例 2：
 * 
 * 
 * 
 * 
 * 输入：mat = [[0,0,0],[0,1,0],[1,1,1]]
 * 输出：[[0,0,0],[0,1,0],[1,2,1]]
 * 
 * 
 * 
 * 
 * 提示：
 * 
 * 
 * m == mat.length
 * n == mat[i].length
 * 1 
 * 1 
 * mat[i][j] is either 0 or 1.
 * mat 中至少有一个 0 
 * 
 * 
 */

// @lc code=start
/**
 * @param {number[][]} mat
 * @return {number[][]}
 */
var updateMatrix = function (mat) {
  const m = mat.length, n = mat[0].length
  const dist = new Array(m).fill(0).map(() => new Array(n))
  const queue = []
  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      dist[i][j] = mat[i][j] ? Number.MAX_SAFE_INTEGER : 0
      mat[i][j] || queue.push([i, j])
    }
  }
  const dir = [[1, 0], [-1, 0], [0, 1], [0, -1]]
  while (queue.length) {
    const [r, c] = queue.shift()
    for (let [dx, dy] of dir) {
      let cx = r + dx, cy = c + dy
      if (cx >= 0 && cx < m && cy >= 0 && cy < n) {
        if (dist[cx][cy] > dist[r][c] + 1) {
          dist[cx][cy] = dist[r][c] + 1
          queue.push([cx, cy])
        }
      }
    }
  }
  return dist
};
// @lc code=end

