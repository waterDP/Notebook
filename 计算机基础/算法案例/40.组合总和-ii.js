/*
 * @lc app=leetcode.cn id=40 lang=javascript
 *
 * [40] 组合总和 II
 */

// @lc code=start
/**
 * @param {number[]} candidates
 * @param {number} target
 * @return {number[][]}
 */
var combinationSum2 = function(candidates, target) {
  const ans = []
  const dfs = (target, path, candidates) => {
    const [first, ...rest] = candidates
    const current = target - first
    if (current === 0) {
      ans.push([...path, first])
      return
    }
    if (current > 0) {
      dfs(current, [...path, first], rest)
    } else {
      dfs(target, path, rest)
    }
  }
  dfs(target, [], candidates)
  return ans
};

console.log(combinationSum2([1, 2, 7, 6, 1, 5], 8))
// @lc code=end

