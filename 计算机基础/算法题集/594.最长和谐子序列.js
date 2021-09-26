/*
 * @lc app=leetcode.cn id=594 lang=javascript
 *
 * [594] 最长和谐子序列
 */

// @lc code=start
/**
 * @param {number[]} nums
 * @return {number}
 */
var findLHS = function(nums) {
  let map = {}, ans = 0
  for (let i = 0; i< nums.length; i++) {
    const item = nums[i]
    map[item] = map[item] ? map[item] + 1 : 1
    if (map[item+1]) {
      ans = Math.max(ans, map[item] + map[item+1])
    } 
    if (map[item-1]) {
      ans = Math.max(ans, map[item]+map[item -1])
    }
  }
  return ans
};
// @lc code=end

