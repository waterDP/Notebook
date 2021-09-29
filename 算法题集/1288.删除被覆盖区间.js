/*
 * @lc app=leetcode.cn id=1288 lang=javascript
 *
 * [1288] 删除被覆盖区间
 */

// @lc code=start
/**
 * @param {number[][]} intervals
 * @return {number}
 */
var removeCoveredIntervals = function(intervals) {
  intervals = intervals.sort((a, b) => {
    if (a[0] === b[0]) {
      return b[1] - a[1]
    }
    return a[0] - b[0]
  })
  for(let i = 1; i < intervals.length; i++) {
    if (intervals[i][1] <= intervals[i-1][1]) {
      intervals.splice(i, 1)
      i -= 1
    }
  }
  return intervals.length
};
// @lc code=end

