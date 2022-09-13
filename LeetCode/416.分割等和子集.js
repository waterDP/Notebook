/*
 * @Author: water.li
 * @Date: 2022-09-13 20:35:37
 * @Description:
 * @FilePath: \note\LeetCode\416.分割等和子集.js
 */
/*
 * @lc app=leetcode.cn id=416 lang=javascript
 *
 * [416] 分割等和子集
 *
 * https://leetcode.cn/problems/partition-equal-subset-sum/description/
 *
 * algorithms
 * Medium (51.94%)
 * Likes:    1488
 * Dislikes: 0
 * Total Accepted:    327.4K
 * Total Submissions: 628.3K
 * Testcase Example:  '[1,5,11,5]'
 *
 * 给你一个 只包含正整数 的 非空 数组 nums 。请你判断是否可以将这个数组分割成两个子集，使得两个子集的元素和相等。
 * 
 * 
 * 
 * 示例 1：
 * 
 * 
 * 输入：nums = [1,5,11,5]
 * 输出：true
 * 解释：数组可以分割成 [1, 5, 5] 和 [11] 。
 * 
 * 示例 2：
 * 
 * 
 * 输入：nums = [1,2,3,5]
 * 输出：false
 * 解释：数组不能分割成两个元素和相等的子集。
 * 
 * 
 * 
 * 
 * 提示：
 * 
 * 
 * 1 
 * 1 
 * 
 * 
 */

// @lc code=start
/**
 * @param {number[]} nums
 * @return {boolean}
 */
 var canPartition = function(nums) {
  const n = nums.length
  if (n < 2) return false

  let sum = 0, maxNum = 0
  for (let num of nums) {
    sum += num
    maxNum = maxNum > num ? maxNum : num
  }

  if (sum & 1) return false // 和为奇数
  const target = Math.floor(sum / 2)
  if (maxNum > target ) return false

  const dp = new Array(target+1).fill(false)
  dp[0] = true
  for (const num of nums) {
    for (let j = target; j >= num; --j) {
      dp[j] |= dp[j - num]
    }
  }
  return dp[target]
};
// @lc code=end

