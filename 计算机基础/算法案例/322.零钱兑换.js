/*
 * @lc app=leetcode.cn id=322 lang=javascript
 *
 * [322] 零钱兑换
 */

// @lc code=start
/**
 * @param {number[]} coins
 * @param {number} amount
 * @return {number}
 */
var coinChange = function(coins, amount) {
  let memo = {}
  function dp(n) {
    if (memo[n]) return memo[n]
    if (n === 0) return 0
    if (n < 0) return -1
    let res = Number.MAX_SAFE_INTEGER
    for (let coin of coins) {
      let sub = dp(n - coin)
      if (sub === -1) continue
      res = Math.min(res, 1 + sub)
    }

    memo[n] = res === Number.MAX_SAFE_INTEGER ? -1 : res
    return memo[n]
  }
  return dp(amount)
};
// @lc code=end

