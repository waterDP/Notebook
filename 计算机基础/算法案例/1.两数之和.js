/*
 * @lc app=leetcode.cn id=1 lang=javascript
 *
 * [1] 两数之和
 */

/** 
 * 给定一个整数数组 nums 和一个目标值 target，请你在该数组中找出和为目标值的那 两个 整数，并返回他们的数组下标。
 * 你可以假设每种输入只会对应一个答案。但是，数组中同一个元素不能使用两遍。 
 */ 

// @lc code=start
/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
var twoSum = function(nums, target) {
  let map = {}
  for (let i = 0; i < nums.length; i++) {
    let temp = target - nums[i]
    if (typeof map[temp] === 'number') {
      return [map[temp], i]
    }
    map[nums[i]] = i
  }
  return [-1, -1]
};

twoSum([2, 7, 11, 15], 9)
// @lc code=end

