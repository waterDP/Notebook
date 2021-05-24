/*
 * @lc app=leetcode.cn id=664 lang=javascript
 *
 * [664] 奇怪的打印机
 */

// @lc code=start
/**
 * @param {string} s
 * @return {number}
 */
var strangePrinter = function (s) {
  const n = s.length
  const f = new Array(n).fill(0).map(() => new Array(n).fill(0))
  for (let i = n - 1; i >= 0; i--) {
    f[i][i] = 1
    for (let j = i + 1; j < n; j++) {
      if (s[i] == s[j]) {
        f[i][j] = f[i][j - 1]
      } else {
        let min = Number.MAX_SAFE_INTEGER
        for (let k = i; k < j; k++) {
          min = Math.min(min, f[i][k] + f[k + 1][j])
          f[i][j] = min
        }
      }
    }
  }
  return f[0][n - 1]
};
// @lc code=end

