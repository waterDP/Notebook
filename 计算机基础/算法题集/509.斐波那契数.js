/*
 * @lc app=leetcode.cn id=509 lang=javascript
 *
 * [509] 斐波那契数
 */

// @lc code=start
/**
 * @param {number} n
 * @return {number}
 */
var fib = function(n) {
  if (n == 0) return 0
  if (n == 1) return 1
  return fib(n-1)+fib(n-2)
};
// @lc code=end

