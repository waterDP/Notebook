/*
 * @lc app=leetcode.cn id=1486 lang=javascript
 *
 * [1486] 数组异或操作
 */

// @lc code=start
/**
 * @param {number} n
 * @param {number} start
 * @return {number}
 */
var xorOperation = function(n, start) {
  let ret = 0
  for (let i = 0; i < n; i++) {
    const a = start + 2 * i
    ret ^= a
  }
  return ret
};
// @lc code=end

var xorOperation = function(n, start) {
  let s = start >> 1, e = n & start & 1;
  let ret = sumXor(s - 1) ^ sumXor(s + n - 1);
  return ret << 1 | e;
};

const sumXor = (x) => {
  if (x % 4 === 0) {
      return x;
  }
  if (x % 4 === 1) {
      return 1;
  }
  if (x % 4 === 2) {
      return x + 1;
  }
  return 0;
}