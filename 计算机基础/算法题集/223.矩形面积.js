/*
 * @lc app=leetcode.cn id=223 lang=javascript
 *
 * [223] 矩形面积
 */

// @lc code=start
/**
 * @param {number} A
 * @param {number} B
 * @param {number} C
 * @param {number} D
 * @param {number} E
 * @param {number} F
 * @param {number} G
 * @param {number} H
 * @return {number}
 */
var computeArea = function(A, B, C, D, E, F, G, H) {
  let width = Math.min(C, G) - Math.max(A, E)
  let height = Math.min(D, H) - Math.max(B, F)
  let common = Math.max(0, width) * Math.max(0, height)
  return (C-A)*(D-B)+(G-E)*(H-F)-common
};
// @lc code=end

