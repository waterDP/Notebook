/*
 * @lc app=leetcode.cn id=90 lang=javascript
 *
 * [90] 子集 II
 */

// @lc code=start
/**
 * @param {number[]} nums
 * @return {number[][]}
 */
var subsetsWithDup = function (nums) {
  let n = nums.length
  nums = nums.sort()
  let tmpPath = []
  let res = []
  let hash = {}
  let backtrack = (tmpPath, start) => {
    res.push(tmpPath)
    for (let i = start; i < n; i++) {
      if (hash[i] || (i > 0 && !hash[i - 1] && nums[i - 1] == nums[i])) continue
      hash[i] = true
      tmpPath.push(nums[i])
      backtrack(tmpPath.slice(), i + 1)
      hash[i] = false
      tmpPath.pop()
    }
  }
  backtrack(tmpPath, 0)
  return res
};
// @lc code=end

