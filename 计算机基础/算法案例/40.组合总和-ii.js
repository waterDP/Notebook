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
  candidates.sort((a, b) => a - b)
  const res = []
  const dfs = (start, temp, sum) => {
    if (sum >= target) {        // 爆掉了，不用继续选数了
      if (sum == target) {      // 加入解集
        res.push(temp.slice())  // temp的拷贝
      }
      return                   // 结束当前递归
    }
    for (let i = start; i < candidates.length; i++) { // 枚举出选择，从start开始
      if (i - 1 >= start && candidates[i - 1] == candidates[i]) {
        continue
      }
      temp.push(candidates[i])        // 加入“部分解”
      dfs(i+1, temp, sum + candidates[i]) // 往下继续选择，同时sum累加上当前数字
      temp.pop()                      // 撤销选择
    }
  }
  dfs(0, [], 0)
  return res
};
// @lc code=end

