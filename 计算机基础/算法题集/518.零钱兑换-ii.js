/*
 * @lc app=leetcode.cn id=518 lang=javascript
 *
 * [518] 零钱兑换 II
 */

// @lc code=start
/**
 * @param {number} amount
 * @param {number[]} coins
 * @return {number}
 */
var change = function(amount, coins) {
  const dp = new Array(amount+1).fill(0)
  dp[0] = 1
  for (const coin of coins) {
    for (let i = coin; i < amount + 1; i++) {
      dp[i] += dp[i-coin]
    }
  }
  return dp[amount]
};
// @lc code=end

