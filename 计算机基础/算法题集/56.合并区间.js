/*
 * @lc app=leetcode.cn id=56 lang=javascript
 *
 * [56] 合并区间
 */

// @lc code=start
/**
 * @param {number[][]} intervals
 * @return {number[][]}
 */
var merge = function(intervals) {
  if (intervals.length < 2) return intervals
  intervals.sort((a, b) => a[0] - b[0])
  const res= []
  res.push(intervals[0])
  for (let i = 1; i < intervals.length; i++) {
    if (intervals[i][0] > res[res.length - 1][1]) {
      res.push(intervals[i])
    } else {
      res[res.length - 1][1] = Math.max(res[res.length - 1][1], intervals[i][1])
    }
  }
  return res
};
// @lc code=end

