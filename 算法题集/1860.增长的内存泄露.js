/*
 * @lc app=leetcode.cn id=1860 lang=javascript
 *
 * [1860] 增长的内存泄露
 */

// @lc code=start
/**
 * @param {number} memory1
 * @param {number} memory2
 * @return {number[]}
 */
var memLeak = function(memory1, memory2) {
  let countTime = 0
  while (true) {
    countTime++
    if (memory1 >= memory2) {
      memory1 -= countTime
    } else {
      memory2 -= countTime
    }

    if (memory1 < 0) {
      memory1 += countTime
      break
    } 
    if (memory2 < 0) {
      memory2 += countTime
      break
    }
  }
  return [countTime, memory1,  memory2]
};
// @lc code=end

