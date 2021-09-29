/*
 * @lc app=leetcode.cn id=441 lang=javascript
 *
 * [441] 排列硬币
 */

// @lc code=start
/**
 * @param {number} n
 * @return {number}
 */
var arrangeCoins = function(n) {
  let h = 0, hc = 1
  while (true) {
    n -= hc++
    if (n < 0) {
      break
    }
    h++
  }
  return h
};
arrangeCoins(5)
// @lc code=end

