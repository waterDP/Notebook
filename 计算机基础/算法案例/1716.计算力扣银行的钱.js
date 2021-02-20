/*
 * @lc app=leetcode.cn id=1716 lang=javascript
 *
 * [1716] 计算力扣银行的钱
 */

// @lc code=start
/**
 * @param {number} n
 * @return {number}
 */
var totalMoney = function(n) {
  let m = parseInt(n/7)
  let sum = 28*m + m*(m - 1)/2*7
  let s = n % 7
  return sum + s * (m+1) + s*(s-1)/2
};
// @lc code=end

