/*
 * @Author: water.li
 * @Date: 2021-11-06 23:45:26
 * @LastEditTime: 2021-11-07 00:00:25
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \notebook\LeetCode\268.丢失的数字.js
 */
/*
 * @lc app=leetcode.cn id=268 lang=javascript
 *
 * [268] 丢失的数字
 *
 * https://leetcode-cn.com/problems/missing-number/description/
 *
 * algorithms
 * Easy (61.85%)
 * Likes:    415
 * Dislikes: 0
 * Total Accepted:    137K
 * Total Submissions: 221.5K
 * Testcase Example:  '[3,0,1]'
 *
 * 给定一个包含 [0, n] 中 n 个数的数组 nums ，找出 [0, n] 这个范围内没有出现在数组中的那个数。
 * 
 * 
 * 
 * 进阶：
 * 
 * 
 * 你能否实现线性时间复杂度、仅使用额外常数空间的算法解决此问题?
 * 
 * 
 * 
 * 
 * 示例 1：
 * 
 * 
 * 输入：nums = [3,0,1]
 * 输出：2
 * 解释：n = 3，因为有 3 个数字，所以所有的数字都在范围 [0,3] 内。2 是丢失的数字，因为它没有出现在 nums 中。
 * 
 * 示例 2：
 * 
 * 
 * 输入：nums = [0,1]
 * 输出：2
 * 解释：n = 2，因为有 2 个数字，所以所有的数字都在范围 [0,2] 内。2 是丢失的数字，因为它没有出现在 nums 中。
 * 
 * 示例 3：
 * 
 * 
 * 输入：nums = [9,6,4,2,3,5,7,0,1]
 * 输出：8
 * 解释：n = 9，因为有 9 个数字，所以所有的数字都在范围 [0,9] 内。8 是丢失的数字，因为它没有出现在 nums 中。
 * 
 * 示例 4：
 * 
 * 
 * 输入：nums = [0]
 * 输出：1
 * 解释：n = 1，因为有 1 个数字，所以所有的数字都在范围 [0,1] 内。1 是丢失的数字，因为它没有出现在 nums 中。
 * 
 * 
 * 
 * 提示：
 * 
 * 
 * n == nums.length
 * 1 
 * 0 
 * nums 中的所有数字都 独一无二
 * 
 * 
 */

// @lc code=start
/**
 * @param {number[]} nums
 * @return {number}
 */
var missingNumber = function(nums) {
  const len = nums.length
  const sum = (1 + len) * len / 2
  return nums.reduce((total, curr) => {
    total -= curr
    return total
  }, sum)
};
// @lc code=end

