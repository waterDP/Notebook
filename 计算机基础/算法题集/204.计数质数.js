/*
 * @lc app=leetcode.cn id=204 lang=javascript
 *
 * [204] 计数质数
 */

// @lc code=start
/**
 * @param {number} n
 * @return {number}
 */
var countPrimes = function(n) {
  const isPrime = new Array(n).fill(1)
  let ans = 0 
  for (let i = 2; i <= n; i++) {
    if (isPrime[i]) {
      ans += 1
      for (let j = i + i; j < n; j += i) {
        isPrime[j] = 0
      }
    }
  }
  return ans
};
// @lc code=end