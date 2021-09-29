/*
 * @lc app=leetcode.cn id=1720 lang=javascript
 *
 * [1720] 解码异或后的数组
 */

// @lc code=start
/**
 * @param {number[]} encoded
 * @param {number} first
 * @return {number[]}
 */
var decode = function(encoded, first) {
  const ret = [first]
  for (const c of encoded) {
    ret.push(c ^ ret[ret.length - 1])
  }
  return ret
};
// @lc code=end

