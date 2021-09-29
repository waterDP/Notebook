/*
 * @lc app=leetcode.cn id=213 lang=javascript
 *
 * [213] 打家劫舍 II
 */

// @lc code=start
/**
 * @param {number[]} nums
 * @return {number}
 */
var rob = function(nums) {
  const length = nums.length
  if (length === 1) return nums[0]
  if (length === 2) return Math.max(nums[0], nums[1])

  const robRange = (start, end) => {
    let current = nums[start], max = Math.max(nums[start], nums[start+1])
    for (let i = start+2; i <= end; i++) {
      const temp = max // 上一次的最大值
      max = Math.max(current+nums[i], max)
      current = temp
    }
    return max
  }

  return Math.max(robRange(0,  length - 2), robRange(1, length -1))
};
// @lc code=end

