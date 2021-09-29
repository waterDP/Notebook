/*
 * @lc app=leetcode.cn id=611 lang=javascript
 *
 * [611] 有效三角形的个数
 */

// @lc code=start
/**
 * @param {number[]} nums
 * @return {number}
 */
var triangleNumber = function(nums) {
  if (!nums || nums.length < 3) return 0
  let count = 0
  nums.sort((a, b) => a - b)

  for (let k = nums.length -1; k > 1; k--) {
    let i = 0, j = k -1
    while(i < j) {
      if (nums[i] + nums[j] > nums[k]) {
        count += j - i
        j--
      } else {
        i++
      }
    }
  }

  return count
};
// @lc code=end

