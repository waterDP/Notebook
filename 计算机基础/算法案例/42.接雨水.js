/*
 * @lc app=leetcode.cn id=42 lang=javascript
 *
 * [42] 接雨水
 *
 * https://leetcode-cn.com/problems/trapping-rain-water/description/
 *
 * algorithms
 * Hard (54.29%)
 * Likes:    2050
 * Dislikes: 0
 * Total Accepted:    195.2K
 * Total Submissions: 359.5K
 * Testcase Example:  '[0,1,0,2,1,0,1,3,2,1,2,1]'
 *
 * 给定 n 个非负整数表示每个宽度为 1 的柱子的高度图，计算按此排列的柱子，下雨之后能接多少雨水。
 * 
 * 
 * 
 * 示例 1：
 * 
 * 
 * 
 * 
 * 输入：height = [0,1,0,2,1,0,1,3,2,1,2,1]
 * 输出：6
 * 解释：上面是由数组 [0,1,0,2,1,0,1,3,2,1,2,1] 表示的高度图，在这种情况下，可以接 6 个单位的雨水（蓝色部分表示雨水）。 
 * 
 * 
 * 示例 2：
 * 
 * 
 * 输入：height = [4,2,0,3,2,5]
 * 输出：9
 * 
 * 
 * 
 * 
 * 提示：
 * 
 * 
 * n == height.length
 * 0 
 * 0 
 * 
 * 
 */

// @lc code=start
/**
 * @param {number[]} height
 * @return {number}
 */
var trap = function(height) {
  let max = 0, volume = 0, leftMax = [], rightMax = []
  for (let i = 0; i < height.length; i++) {
    leftMax[i] = max = Math.max(height[i], max)
  }
  max = 0
  for (let i = height.length -1; i >= 0; i--) {
    rightMax[i] = max = Math.max(height[i], max)
  }
  for (let i = 0; i < height.length; i++) {
    volume += Math.min(leftMax[i], rightMax[i]) - height[i]
  }
  return volume
};
// @lc code=end

