/*
 * @Author: water.li
 * @Date: 2022-03-25 22:40:20
 * @Description: 
 * @FilePath: \notebook\LeetCode\485.最大连续-1-的个数.js
 */
/*
 * @lc app=leetcode.cn id=485 lang=javascript
 *
 * [485] 最大连续 1 的个数
 *
 * https://leetcode-cn.com/problems/max-consecutive-ones/description/
 *
 * algorithms
 * Easy (60.95%)
 * Likes:    306
 * Dislikes: 0
 * Total Accepted:    144.7K
 * Total Submissions: 237.5K
 * Testcase Example:  '[1,1,0,1,1,1]'
 *
 * 给定一个二进制数组 nums ， 计算其中最大连续 1 的个数。
 * 
 * 
 * 
 * 示例 1：
 * 
 * 
 * 输入：nums = [1,1,0,1,1,1]
 * 输出：3
 * 解释：开头的两位和最后的三位都是连续 1 ，所以最大连续 1 的个数是 3.
 * 
 * 
 * 示例 2:
 * 
 * 
 * 输入：nums = [1,0,1,1,0,1]
 * 输出：2
 * 
 * 
 * 
 * 
 * 提示：
 * 
 * 
 * 1 <= nums.length <= 10^5
 * nums[i] 不是 0 就是 1.
 * 
 * 
 */

// @lc code=start
/**
 * @param {number[]} nums
 * @return {number}
 */
var findMaxConsecutiveOnes = function(nums) {
  let maxCount = 0, count = 0
  const n = nums.length
  for (let i = 0; i < n; i++) {
    if (nums[i] === 1) {
      count++
    } else {
      maxCount = Math.max(maxCount, count)
      count = 0
    }
  }
  maxCount = Math.max(maxCount, count)
  return maxCount
};
// @lc code=end

