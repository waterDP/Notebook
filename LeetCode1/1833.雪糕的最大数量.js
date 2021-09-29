/*
 * @lc app=leetcode.cn id=1833 lang=javascript
 *
 * [1833] 雪糕的最大数量
 */

// @lc code=start
/**
 * @param {number[]} costs
 * @param {number} coins
 * @return {number}
 */
var maxIceCream = function(costs, coins) {
  costs.sort((a, b) => a - b)
  let count = 0
  for (let c of costs) {
    if (coins >= c) {
      count++
      coins -= c
    } else {
      break
    }
  }
  return count
};
// @lc code=end

