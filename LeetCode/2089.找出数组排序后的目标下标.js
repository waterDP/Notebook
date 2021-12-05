/*
 * @Author: water.li
 * @Date: 2021-12-05 21:42:39
 * @Description: 
 * @FilePath: \notebook\LeetCode\2089.找出数组排序后的目标下标.js
 */
/*
 * @lc app=leetcode.cn id=2089 lang=javascript
 *
 * [2089] 找出数组排序后的目标下标
 *
 * https://leetcode-cn.com/problems/find-target-indices-after-sorting-array/description/
 *
 * algorithms
 * Easy (85.39%)
 * Likes:    4
 * Dislikes: 0
 * Total Accepted:    5.9K
 * Total Submissions: 6.9K
 * Testcase Example:  '[1,2,5,2,3]\n2'
 *
 * 给你一个下标从 0 开始的整数数组 nums 以及一个目标元素 target 。
 * 
 * 目标下标 是一个满足 nums[i] == target 的下标 i 。
 * 
 * 将 nums 按 非递减 顺序排序后，返回由 nums 中目标下标组成的列表。如果不存在目标下标，返回一个 空 列表。返回的列表必须按 递增
 * 顺序排列。
 * 
 * 
 * 
 * 示例 1：
 * 
 * 输入：nums = [1,2,5,2,3], target = 2
 * 输出：[1,2]
 * 解释：排序后，nums 变为 [1,2,2,3,5] 。
 * 满足 nums[i] == 2 的下标是 1 和 2 。
 * 
 * 
 * 示例 2：
 * 
 * 输入：nums = [1,2,5,2,3], target = 3
 * 输出：[3]
 * 解释：排序后，nums 变为 [1,2,2,3,5] 。
 * 满足 nums[i] == 3 的下标是 3 。
 * 
 * 
 * 示例 3：
 * 
 * 输入：nums = [1,2,5,2,3], target = 5
 * 输出：[4]
 * 解释：排序后，nums 变为 [1,2,2,3,5] 。
 * 满足 nums[i] == 5 的下标是 4 。
 * 
 * 
 * 示例 4：
 * 
 * 输入：nums = [1,2,5,2,3], target = 4
 * 输出：[]
 * 解释：nums 中不含值为 4 的元素。
 * 
 * 
 * 
 * 
 * 提示：
 * 
 * 
 * 1 <= nums.length <= 100
 * 1 <= nums[i], target <= 100
 * 
 * 
 */

// @lc code=start
/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
var targetIndices = function(nums, target) {
  let cnt1 = 0 // 小于target的数量
  let cnt2 = 0 // 等于target的数量
  nums.forEach(item => {
    item < target && cnt1++
    item === target && cnt2++
  })
  let res = []
  for (let i = cnt1; i < cnt1 + cnt2; i++) {
    res.push(i)
  }
  return res
};
// @lc code=end

