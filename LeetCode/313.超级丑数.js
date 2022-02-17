/*
 * @Author: water.li
 * @Date: 2021-09-29 22:34:31
 * @Description: 
 * @FilePath: \notebook\LeetCode\313.超级丑数.js
 */
/*
 * @lc app=leetcode.cn id=313 lang=javascript
 *
 * [313] 超级丑数
 */

// @lc code=start
var nthSuperUglyNumber = function (n, primes) {
  const dp = new Array(n + 1).fill(0);
  const m = primes.length;
  const pointers = new Array(m).fill(0);
  const nums = new Array(m).fill(1);
  for (let i = 1; i <= n; i++) {
    let minNum = Number.MAX_SAFE_INTEGER;
    for (let j = 0; j < m; j++) {
      minNum = Math.min(minNum, nums[j]);
    }
    dp[i] = minNum;
    for (let j = 0; j < m; j++) {
      if (nums[j] == minNum) {
        pointers[j]++;
        nums[j] = dp[pointers[j]] * primes[j];
      }
    }
  }
  return dp[n]
}

// @lc code=end

