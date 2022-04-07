/*
 * @Author: water.li
 * @Date: 2022-04-07 22:45:50
 * @Description: 
 * @FilePath: \notebook\LeetCode\220.存在重复元素-iii.js
 */
/*
 * @lc app=leetcode.cn id=220 lang=javascript
 *
 * [220] 存在重复元素 III
 *
 * https://leetcode-cn.com/problems/contains-duplicate-iii/description/
 *
 * algorithms
 * Medium (28.88%)
 * Likes:    585
 * Dislikes: 0
 * Total Accepted:    75.4K
 * Total Submissions: 261.2K
 * Testcase Example:  '[1,2,3,1]\n3\n0'
 *
 * 给你一个整数数组 nums 和两个整数 k 和 t 。请你判断是否存在 两个不同下标 i 和 j，使得 abs(nums[i] - nums[j])
 * ，同时又满足 abs(i - j)  。
 * 
 * 如果存在则返回 true，不存在返回 false。
 * 
 * 
 * 
 * 示例 1：
 * 
 * 
 * 输入：nums = [1,2,3,1], k = 3, t = 0
 * 输出：true
 * 
 * 示例 2：
 * 
 * 
 * 输入：nums = [1,0,1,1], k = 1, t = 2
 * 输出：true
 * 
 * 示例 3：
 * 
 * 
 * 输入：nums = [1,5,9,1,5,9], k = 2, t = 3
 * 输出：false
 * 
 * 
 * 
 * 提示：
 * 
 * 
 * 0 
 * -2^31 
 * 0 
 * 0 
 * 
 * 
 */

// @lc code=start
/**
 * @param {number[]} nums
 * @param {number} k
 * @param {number} t
 * @return {boolean}
 */
var containsNearbyAlmostDuplicate = function(nums, k, t) {
  const getID = (x, w) => x < 0 ? Math.floor((x + 1) / w) - 1 : Math.floor(x / w)
  const n = nums.length
  const mp = new Map()
  for (let i = 0; i < n; i++) {
    const x = nums[i]
    const id = getID(x, t + 1)
    if (mp.has(id)) {
      return true
    }
    // 检查相邻桶
    if (mp.has(id - 1) && Math.abs(x - mp.get(id - 1)) <= t) {
      return true
    }
    if (mp.has(id + 1) && Math.abs(x - mp.get(id + 1)) <= t) {
      return true
    }
    mp.set(id, x)
    if (i >= k) {
      mp.delete(getID(nums[i - k], t + 1))
    }
  }
  return false
};
// @lc code=end

