/*
 * @lc app=leetcode.cn id=1037 lang=javascript
 *
 * [1037] 有效的回旋镖
 */

// @lc code=start
/**
 * @param {number[][]} points
 * @return {boolean}
 */
var isBoomerang = function(points) {
  let dx = points[1][0] - points[0][0] 
  let dy = points[1][1] - points[0][1]
  let ex = points[2][0] - points[1][0]
  let ey = points[2][1] - points[1][1]

  return dx*ey !== ex*dy
};
// @lc code=end

