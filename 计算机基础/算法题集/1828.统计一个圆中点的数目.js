/*
 * @lc app=leetcode.cn id=1828 lang=javascript
 *
 * [1828] 统计一个圆中点的数目
 */

// @lc code=start
/**
 * @param {number[][]} points
 * @param {number[][]} queries
 * @return {number[]}
 */
var countPoints = function(points, queries) {
  let distance = (x1, y1, x2, y2) => {
    return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2))
  }

  const ret  = new Array(queries.length).fill(0)
  for (let i = 0; i < queries.length; i++) {
    const [x, y, r] = queries[i]
    for (let j = 0; j < points.length; j++) {
      const [px, py] = points[j]
      if (distance(x, y, px, py) <= r) {
        ret[i]++
      }
    }
  }
  return ret
};
// @lc code=end

