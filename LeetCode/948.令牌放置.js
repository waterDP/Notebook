/*
 * @lc app=leetcode.cn id=948 lang=javascript
 *
 * [948] 令牌放置
 */

// @lc code=start
/**
 * @param {number[]} tokens
 * @param {number} power
 * @return {number}
 */
var bagOfTokensScore = function (tokens, power) {
  tokens.sort((a, b) => a - b)
  let lo = 0, hi = tokens.length - 1
  let points = 0, ans = 0
  while (lo <= hi && (power >= tokens[lo] || points > 0)) {
    while (lo <= hi && power >= tokens[lo]) {
      power -= tokens[lo++]
      points++
    }
    ans = Math.max(ans, points)
    if (lo <= hi && points > 0) {
      power += tokens[hi--]
      points--
    }
  }

  return ans
};
bagOfTokensScore([100, 200, 300, 400], 200)
// @lc code=end

