/*
 * @lc app=leetcode.cn id=47 lang=javascript
 *
 * [47] 全排列 II
 */

// @lc code=start
/**
 * @param {number[]} nums
 * @return {number[][]}
 */
var permuteUnique = function(nums) {
  const res = []
  const len = nums.length
  const vis = new Array(len).fill(false)

  const backtrack = (idx, perm) => {
    if (idx === len) {
      res.push(perm.slice())
      return 
    }
    for (let i = 0; i < len; i++) {
      if (vis[i] || (i>0 && nums[i]===nums[i-1] && vis[i-1])) continue
      perm.push(nums[i])
      vis[i] = true
      backtrack(idx+1, perm)
      vis[i] = false
      perm.pop()
    }
  }
  nums.sort((x, y) => x-y)
  backtrack(0, [])
  return res
};
// @lc code=end

