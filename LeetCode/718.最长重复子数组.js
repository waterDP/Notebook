/*
 * @Author: your name
 * @Date: 2021-11-01 17:23:53
 * @LastEditTime: 2021-11-01 17:40:44
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \notebook\LeetCode\718.最长重复子数组.js
 */
/*
 * @lc app=leetcode.cn id=718 lang=javascript
 *
 * [718] 最长重复子数组
 *
 * https://leetcode-cn.com/problems/maximum-length-of-repeated-subarray/description/
 *
 * algorithms
 * Medium (56.45%)
 * Likes:    562
 * Dislikes: 0
 * Total Accepted:    87.1K
 * Total Submissions: 154.2K
 * Testcase Example:  '[1,2,3,2,1]\n[3,2,1,4,7]'
 *
 * 给两个整数数组 A 和 B ，返回两个数组中公共的、长度最长的子数组的长度。
 * 
 * 
 * 
 * 示例：
 * 
 * 输入：
 * A: [1,2,3,2,1]
 * B: [3,2,1,4,7]
 * 输出：3
 * 解释：
 * 长度最长的公共子数组是 [3, 2, 1] 。
 * 
 * 
 * 
 * 
 * 提示：
 * 
 * 
 * 1 <= len(A), len(B) <= 1000
 * 0 <= A[i], B[i] < 100
 * 
 * 
 */

// @lc code=start
/**
 * @param {number[]} nums1
 * @param {number[]} nums2
 * @return {number}
 */
var findLength = function(nums1, nums2) {
  const maxLen = (a, i, b, j, len) => {
    let count = 0, max = 0
    for (let k = 0; k < len; k++) {
      if (a[i+k] === b[j+k]) {
        count++
      } else if (count > 0) {
        max = Math.max(max, count)
        count = 0
      }
    }

    return count > 0 ? Math.max(max, count) : max
  }
  const findMax = (a, b) => {
    let max = 0
    let an = a.length, bn = b.length
    for (let len = 1; len <= an; len++) {
      max = Math.max(max, maxLen(a, 0, b, bn-len, len))
    }
    for (let j = bn -an; j >= 0; j--) {
      max = Math.max(max, maxLen(a, 0, b, j, an))
    }
    for (let i = 1; i < an; i++) {
      max = Math.max(max, maxLen(a, i, b, 0, an-i))
    }
    return max
  }
  return nums1.length > nums2.length ? findMax(nums1, nums2) : findMax(nums2, nums1)
};
// @lc code=end

