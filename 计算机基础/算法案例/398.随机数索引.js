/*
 * @lc app=leetcode.cn id=398 lang=javascript
 *
 * [398] 随机数索引
 */

// @lc code=start
/**
 * @param {number[]} nums
 */
var Solution = function(nums) {
  let map = new Map()
  for (let i = 0; i<nums.length; i++) {
    map.has(nums[i]) ? map.get(nums[i]).push(i) : map.set(nums[i], [i])
  }
  this.cache = map
};

/** 
 * @param {number} target
 * @return {number}
 */
Solution.prototype.pick = function(target) {
  let arr = this.cache.get(target)
  return arr[Math.floor(Math.random() * arr.length)]
};

/**
 * Your Solution object will be instantiated and called as such:
 * var obj = new Solution(nums)
 * var param_1 = obj.pick(target)
 */
// @lc code=end

