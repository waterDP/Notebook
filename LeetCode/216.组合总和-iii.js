/*
 * @lc app=leetcode.cn id=216 lang=javascript
 *
 * [216] 组合总和 III
 */

// @lc code=start
/**
 * @param {number} k
 * @param {number} n
 * @return {number[][]}
 */
var combinationSum3 = function(k, n) {
  const temp = []
  const res = []
  const dfs = (cur, end, k, target, res) => {
		if (temp.length + (end-cur + 1) < k || temp.length > k) {
      return 
    }
    if (temp.length === k && 
      temp.reduce((total, current) => total + current) === target) {
      res.push(temp.slice())
      return 
    }
    temp.push(cur)
    dfs(cur+1, end, k, target, res)
    temp.pop()
    dfs(cur+1, end, k, target, res)
  }
  dfs(1, 9, k, n, res)
  return res
};
// @lc code=end

