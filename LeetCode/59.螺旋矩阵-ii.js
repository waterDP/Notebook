/*
 * @Author: water.li
 * @Date: 2022-09-24 21:34:17
 * @Description: 
 * @FilePath: \note\LeetCode\59.螺旋矩阵-ii.js
 */
/*
 * @lc app=leetcode.cn id=59 lang=javascript
 *
 * [59] 螺旋矩阵 II
 *
 * https://leetcode.cn/problems/spiral-matrix-ii/description/
 *
 * algorithms
 * Medium (75.38%)
 * Likes:    825
 * Dislikes: 0
 * Total Accepted:    244.4K
 * Total Submissions: 325.1K
 * Testcase Example:  '3'
 *
 * 给你一个正整数 n ，生成一个包含 1 到 n^2 所有元素，且元素按顺时针顺序螺旋排列的 n x n 正方形矩阵 matrix 。
 * 
 * 
 * 
 * 示例 1：
 * 
 * 
 * 输入：n = 3
 * 输出：[[1,2,3],[8,9,4],[7,6,5]]
 * 
 * 
 * 示例 2：
 * 
 * 
 * 输入：n = 1
 * 输出：[[1]]
 * 
 * 
 * 
 * 
 * 提示：
 * 
 * 
 * 1 
 * 
 * 
 */

// @lc code=start
/**
 * @param {number} n
 * @return {number[][]}
 */
var generateMatrix = function(n) {
  const ret = new Array(n).fill(0).map(() => new Array(n).fill(0))
  const directors = [[0, 1], [1, 0], [0, -1], [-1, 0]]

  let status = 1, position = [0, 0], director = 0

  const nextPosition = position => {
    let [cx, cy] = position
    let [dx, dy] = directors[director]
    let [mx, my] = [cx+dx, cy+dy]
    if (mx >= 0 && mx < n && my >= 0 && my < n && ret[mx][my] === 0) {
      return [mx, my]
    }
    director = (director+1) % 4
    return nextPosition(position)
  }

  while (true) {
    const [x, y] = position
    ret[x][y] = status
    if (status == n * n) break
    position = nextPosition(position)
    status++
  }
  return ret
};

// @lc code=end

