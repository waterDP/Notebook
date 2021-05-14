/*
 * @lc app=leetcode.cn id=470 lang=javascript
 *
 * [470] 用 Rand7() 实现 Rand10()
 */

// @lc code=start
/**
 * The rand7() API is already defined for you.
 * var rand7 = function() {}
 * @return {number} a random integer in the range 1 to 7
 */
var rand10 = function() {
  let idx
  do {
    const row = rand7()
    const col = rand7()
    idx = col + (row - 1) * 7
  } while (idx > 40)
  return 1 + (idx - 1) % 10
};
// @lc code=end

