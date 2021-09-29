/*
 * @lc app=leetcode.cn id=1232 lang=javascript
 *
 * [1232] 缀点成线
 */

// @lc code=start
/**
 * @param {number[][]} coordinates
 * @return {boolean}
 */
var checkStraightLine = function(coordinates) {
  let n = coordinates.length
  let [x0, y0] = coordinates[0]
  let dx = coordinates[1][0] - x0
  let dy = coordinates[1][1] - y0
  for (let i = 2; i < n; i++) {
    let dxi = coordinates[i][0] - x0
    let dyi = coordinates[i][1] - y0
    if (dy*dxi - dx*dyi) {
      return false
    }
  }
  return true
};
// @lc code=end

