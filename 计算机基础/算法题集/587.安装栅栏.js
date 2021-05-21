/*
 * @lc app=leetcode.cn id=587 lang=javascript
 *
 * [587] 安装栅栏
 */

// @lc code=start
/**
 * ! 单调链
 * @param {number[][]} trees
 * @return {number[][]}
 */
var outerTrees = function (points) {
  if (points.length <= 1){
    return points
  }
  
  points.sort((a, b) => a[0] - b[0] == 0 ? a[1] - b[1] : a[0] - b[0])
  
  let result = []
  
  const orientation = (a, b, c) => {
    return (a[1] - b[1]) * (c[0] - a[0]) - (a[0] - b[0]) * (c[1] - a[1])
  }

  for (var i = 0; i < points.length; i++) {
    const o = orientation(
      result[result.length - 2], 
      result[result.length - 1], 
      points[i],
    )

    while (result.length >= 2 &&  o > 0){
      result.pop()
    }
    result.push(points[i])
  }
  result.pop()

  for (var i = points.length - 1; i >= 0; i--) {
    const o = orientation(
      result[result.length - 2],
      result[result.length - 1], 
      points[i]
    )
    while (result.length >= 2 && o > 0) {
      result.pop()
    }
    result.push(points[i])
  }

  return new Array(...new Set(result))
};
// @lc code=end

