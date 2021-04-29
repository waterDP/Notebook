/*
 * @lc app=leetcode.cn id=650 lang=javascript
 *
 * [650] 只有两个键的键盘
 */

// @lc code=start
/**
 * @param {number} n
 * @return {number}
 */
var minSteps = function(n) {
  let ret = 0
  let d = 2
  while (n > 1) {
    while (n % d === 0) {
      ret += d
      n  /= d
    }
    d++
  }
  return ret
};
// @lc code=end

