/*
 * @lc app=leetcode.cn id=1798 lang=javascript
 *
 * [1798] 你能构造出连续值的最大数目
 */

// @lc code=start
/**
 * @param {number[]} coins
 * @return {number}
 */
var getMaximumConsecutive = function(coins) {
  coins.sort((a, b) => a - b)

  let x = 0
  for (let coin of coins) {
    if (coin > x+1) {
      break
    }
    x += coin
  }
  return x+1
};
// @lc code=end

