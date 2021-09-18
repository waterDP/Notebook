/*
 * @lc app=leetcode.cn id=474 lang=javascript
 *
 * [474] 一和零
 */

// @lc code=start
/**
 * @param {string[]} strs
 * @param {number} m
 * @param {number} n
 * @return {number}
 */
 var findMaxForm = function(strs, m, n) {
  const length = strs.length
  const dp = new Array(length + 1).fill(0).map(() => new Array(m + 1).fill(0).map(() => new Array(n + 1).fill(0)));
  for (let i = 1; i <= length; i++) {
      const zerosOnes = getZerosOnes(strs[i - 1])
      let zeros = zerosOnes[0], ones = zerosOnes[1]
      for (let j = 0; j <= m; j++) {
          for (let k = 0; k <= n; k++) {
              dp[i][j][k] = dp[i - 1][j][k]
              if (j >= zeros && k >= ones) {
                  dp[i][j][k] = Math.max(dp[i][j][k], dp[i - 1][j - zeros][k - ones] + 1);
              }
          }
      }
  }
  return dp[length][m][n]
}

const getZerosOnes = (str) => {
  const zerosOnes = new Array(2).fill(0);
  const length = str.length
  for (let i = 0; i < length; i++) {
      zerosOnes[str[i].charCodeAt() - '0'.charCodeAt()]++
  }
  return zerosOnes

}
// @lc code=end

