/*
 * @lc app=leetcode.cn id=1688 lang=javascript
 *
 * [1688] 比赛中的配对次数
 */

// @lc code=start
/**
 * @param {number} n
 * @return {number}
 */
var numberOfMatches = function(n) {
  let ret = 0
  while (n !== 1) {
    if (n % 2  === 0) {
      let k = n / 2
      ret += k
      n = k
    } else {
      let k = Math.floor(n/2)
      ret += k
      n = k + 1
    }
  }
  return ret
};

// @lc code=end

