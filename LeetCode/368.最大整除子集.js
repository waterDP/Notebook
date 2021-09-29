/*
 * @lc app=leetcode.cn id=368 lang=javascript
 *
 * [368] 最大整除子集
 */

// @lc code=start
/**
 * @param {number[]} nums
 * @return {number[]}
 */
var largestDivisibleSubset = function(nums) {
  const len = nums.length
  nums.sort((a, b) => a -b)

  const dp = new Array(len).fill(1)
  let maxSize = 1
  let maxVal = nums[0]
  for (let i = 1; i < len; i++) {
    for (let j = 0; j < i; j++) {
      if (nums[i] % nums[j] === 0) {
        dp[i] = Math.max(dp[i], dp[j]+1)
      }
    }
    if (dp[i] > maxSize) {
      maxSize = dp[i]
      maxVal = nums[i]
    }
  }

  const res = []
  if (maxSize === 1) {
    res.push(nums[0])
    return res
  }

  for (let i = len - 1; i >=0 && maxSize > 0; i--) {
    if (dp[i] === maxSize && maxVal % nums[i] === 0)  {
      res.push(nums[i])
      maxVal = nums[i]
      maxSize--
    }
  }
  return res
};
// @lc code=end

