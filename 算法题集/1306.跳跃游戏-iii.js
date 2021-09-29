/*
 * @lc app=leetcode.cn id=1306 lang=javascript
 *
 * [1306] 跳跃游戏 III
 */

// @lc code=start
/**
 * @param {number[]} arr
 * @param {number} start
 * @return {boolean}
 */
var canReach = function(arr, start) {
  let res = false
  const dfs = pos => {
    if (arr[pos] === -1) {
      return
    }
    if (arr[pos] === 0) {
      res = true
      return
    }
    const current = arr[pos]
    arr[pos] = -1
    if (pos + current < arr.length) {
      dfs(pos + current)
    }
    if (pos - current >= 0) {
      dfs(pos - current)
    }
  }
  dfs(start) 
  return res
};
// @lc code=end

