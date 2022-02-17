/*
 * @Author: water.li
 * @Date: 2022-02-17 21:58:52
 * @Description: 
 * @FilePath: \notebook\LeetCode\912.排序数组.js
 */
/*
 * @lc app=leetcode.cn id=912 lang=javascript
 *
 * [912] 排序数组
 *
 * https://leetcode-cn.com/problems/sort-an-array/description/
 *
 * algorithms
 * Medium (55.67%)
 * Likes:    474
 * Dislikes: 0
 * Total Accepted:    284.5K
 * Total Submissions: 511.2K
 * Testcase Example:  '[5,2,3,1]'
 *
 * 给你一个整数数组 nums，请你将该数组升序排列。
 * 
 * 
 * 
 * 
 * 
 * 
 * 示例 1：
 * 
 * 
 * 输入：nums = [5,2,3,1]
 * 输出：[1,2,3,5]
 * 
 * 
 * 示例 2：
 * 
 * 
 * 输入：nums = [5,1,1,2,0,0]
 * 输出：[0,0,1,1,2,5]
 * 
 * 
 * 
 * 
 * 提示：
 * 
 * 
 * 1 <= nums.length <= 5 * 10^4
 * -5 * 10^4 <= nums[i] <= 5 * 10^4
 * 
 * 
 */

// @lc code=start
/**
 * @param {number[]} nums
 * @return {number[]}
 */
var sortArray = function(nums) {
  function quickSort(arr, left, right) {
    left = typeof left === 'number' ? left : 0
    right = typeof right === 'number' ? right : arr.length - 1
    if (left < right) {
      let partitionIndex = partition(arr, left, right)
      quickSort(arr, left, partitionIndex - 1)
      quickSort(arr, partitionIndex + 1, right)
    }
    return arr
  }
  
  function partition(arr, left, right) {
    const swap = (i, j) => [arr[i], arr[j]] = [arr[j], arr[i]]
  
    let pivot = left, index = pivot + 1
    for (let i = index; i <= right; i++) {
      if (arr[i] < arr[pivot]) {
        swap(index, i)
        index++
      }
    }
    swap(pivot, index - 1)
    return index - 1
  }
  
  return quickSort(nums)
};
// @lc code=end

