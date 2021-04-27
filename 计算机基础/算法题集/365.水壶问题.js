/*
 * @lc app=leetcode.cn id=365 lang=javascript
 *
 * [365] 水壶问题
 */

// @lc code=start
/**
 * @param {number} jug1
 * @param {number} jug2
 * @param {number} target
 * @return {boolean}
 */
var canMeasureWater = function(jug1, jug2, target) {
  if (jug1 + jug2 < target) return false
  if (jug1 == 0||jug2 == 0) 
    return target == 0 || (jug1+jug2 == target)
  const gcd = (a, b) => b === 0 ? a : gcd(b, a%b)
  return target % gcd(jug1, jug2) == 0
};
// @lc code=end