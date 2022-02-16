/*
 * @Author: water.li
 * @Date: 2022-02-16 21:46:52
 * @Description: 
 * @FilePath: \notebook\LeetCode\152.乘积最大子数组.js
 */
/*
 * @lc app=leetcode.cn id=152 lang=javascript
 *
 * [152] 乘积最大子数组
 *
 * https://leetcode-cn.com/problems/maximum-product-subarray/description/
 *
 * algorithms
 * Medium (42.35%)
 * Likes:    1488
 * Dislikes: 0
 * Total Accepted:    221.4K
 * Total Submissions: 522.2K
 * Testcase Example:  '[2,3,-2,4]'
 *
 * 给你一个整数数组 nums ，请你找出数组中乘积最大的非空连续子数组（该子数组中至少包含一个数字），并返回该子数组所对应的乘积。
 * 
 * 测试用例的答案是一个 32-位 整数。
 * 
 * 子数组 是数组的连续子序列。
 * 
 * 
 * 
 * 示例 1:
 * 
 * 
 * 输入: nums = [2,3,-2,4]
 * 输出: 6
 * 解释: 子数组 [2,3] 有最大乘积 6。
 * 
 * 
 * 示例 2:
 * 
 * 
 * 输入: nums = [-2,0,-1]
 * 输出: 0
 * 解释: 结果不能为 2, 因为 [-2,-1] 不是子数组。
 * 
 * 
 * 
 * 提示:
 * 
 * 
 * 1 <= nums.length <= 2 * 10^4
 * -10 <= nums[i] <= 10
 * nums 的任何前缀或后缀的乘积都 保证 是一个 32-位 整数
 * 
 * 
 */

// @lc code=start
/**
 * @param {number[]} nums
 * @return {number}
 */
var maxProduct = function(nums) {
  let maxF = minF = ans = nums[0]
  for (let i = 1; i < nums.length; i++) {
    let max = maxF, min = minF
    maxF = Math.max(max*nums[i], min*nums[i], nums[i])
    minF = Math.min(min*nums[i], nums[i], max*nums[i])
    ans = Math.max(maxF, ans)
  }
  return ans
};
// @lc code=end

