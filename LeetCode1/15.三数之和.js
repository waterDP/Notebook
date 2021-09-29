/*
 * @lc app=leetcode.cn id=15 lang=javascript
 *
 * [15] 三数之和
 */

// @lc code=start
/**
 * @param {number[]} nums
 * @return {number[][]}
 */
var threeSum = function(nums) {
  nums.sort((a, b) => a-b)
  const ret = [], n = nums.length
  for (let first = 0; first < n; ++first) {
    if (first > 0 && nums[first - 1] === nums[first]) {
      continue
    }
    let third = n - 1
    let target = -nums[first]
    for (let second = first+1; second < n; ++second) {
      if (second > first + 1 && nums[second] == nums[second - 1]) {
        continue
      }
      while (second < third && nums[second] + nums[third] > target) {
        --third
      }
      if (second === third) {
        break
      }
      if (nums[second] + nums[third] == target) {
        ret.push([nums[first], nums[second], nums[third]])
      }
    }
  }
  return ret
};
// @lc code=end


// @after-stub-for-debug-begin
module.exports = threeSum;
// @after-stub-for-debug-end