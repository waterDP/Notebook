/*
 * @lc app=leetcode.cn id=461 lang=javascript
 *
 * [461] 汉明距离
 */

// @lc code=start 布赖恩-克尼根算法
/**
 * @param {number} x
 * @param {number} y
 * @return {number}
 */
var hammingDistance = function(x, y) {
  let v = x ^ y  // 异或 相同位为0，不同位为1
  let dis = 0
  while (v) {
    v = v & (v-1)
    ++dis
  }
  return dis
};
// @lc code=end

