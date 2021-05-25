/*
 * @lc app=leetcode.cn id=1760 lang=javascript
 *
 * [1760] 袋子里最少数目的球
 */

// @lc code=start
/**
 * @param {number[]} nums
 * @param {number} maxOperations
 * @return {number}
 */
var minimumSize = function (nums, maxOperations) {
  let l = 0, r = Math.max(...nums)
  while (l + 1 < r) {
    let mid = Math.floor(l + (r - l) / 2), temp = 0
    for (let n of nums) {
      temp += Math.floor((n - 1) / mid)
    }
    if (temp <= maxOperations) {
      r = mid
    } else {
      l = mid
    }
  }
  return r
};
// @lc code=end

