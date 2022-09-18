/*
 * @Author: water.li
 * @Date: 2022-04-16 20:38:02
 * @Description: 
 * @FilePath: \note\LeetCode\231.2-的幂.js
 */
/*
 * @lc app=leetcode.cn id=231 lang=javascript
 *
 * [231] 2的幂
 * 
 * 一个数 nn 是 2 的幂，当且仅当 n 是正整数，并且 n 的二进制表示中仅包含 1个 1
 * 
 */

// @lc code=start
/**
 * @param {number} n
 * @return {boolean}
 */
var isPowerOfTwo = function(n) {
  return n > 0 && (n & (n - 1)) === 0
};
// @lc code=end

