/*
 * @lc app=leetcode.cn id=984 lang=javascript
 *
 * [984] 不含 AAA 或 BBB 的字符串
 */

// @lc code=start
/**
 * @param {number} a
 * @param {number} b
 * @return {string}
 */
var strWithout3a3b = function(a, b) {
  let ret  = '', con = 0
  while (a > 0 || b > 0) {
    const lastTwo = ret.substr(ret.length - 2)
    if (a > b) {
      if (lastTwo !== 'aa') {
        ret += 'a'
        a--
      } else {
        ret += 'b'
        b--
      }
    } else {
      if (lastTwo !== 'bb') {
        ret += 'b'
        b--
      } else {
        ret += 'a'
        a--
      }
    }
  }
  return ret
};
strWithout3a3b(1,2)
// @lc code=end

