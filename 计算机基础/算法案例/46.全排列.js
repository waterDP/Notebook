/*
 * @lc app=leetcode.cn id=46 lang=javascript
 *
 * [46] 全排列
 *
 * https://leetcode-cn.com/problems/permutations/description/
 *
 * algorithms
 * Medium (77.54%)
 * Likes:    1135
 * Dislikes: 0
 * Total Accepted:    254.8K
 * Total Submissions: 328.4K
 * Testcase Example:  '[1,2,3]'
 *
 * 给定一个 没有重复 数字的序列，返回其所有可能的全排列。
 * 
 * 示例:
 * 
 * 输入: [1,2,3]
 * 输出:
 * [
 * ⁠ [1,2,3],
 * ⁠ [1,3,2],
 * ⁠ [2,1,3],
 * ⁠ [2,3,1],
 * ⁠ [3,1,2],
 * ⁠ [3,2,1]
 * ]
 * 
 */

// @lc code=start
/**
 * @param {number[]} nums
 * @return {number[][]}
 */
var permute = function(nums) {
  const res = []
  const used = {}
  const dfs = (path) => {
    if (path.length === nums.length) {
      res.push(path.slice())
      return
    }
    for (const num of nums) {
      if (used[num]) continue
      path.push(num)
      used[num] = true
      dfs(path)
      used[num] = false
      path.pop()
    }
  }
  dfs([])
  return res
};
// @lc code=end

