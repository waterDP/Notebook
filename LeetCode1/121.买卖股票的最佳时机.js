/*
 * @lc app=leetcode.cn id=121 lang=javascript
 *
 * [121] 买卖股票的最佳时机
 */

// @lc code=start
/**
 * @param {number[]} prices
 * @return {number}
 */
var maxProfit = function(prices) {
  if (prices.length < 2) return 0
  let ret = 0
  let current = prices[0]
  prices.forEach(p => {
    if (p < current) {
      current = p 
    } else if (p - current > ret) {
      ret = p - current
    }
  })
  return ret
};
// @lc code=end

