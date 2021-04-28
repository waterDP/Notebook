/*
 * @lc app=leetcode.cn id=134 lang=javascript
 *
 * [134] 加油站
 */

// @lc code=start
/**
 * @param {number[]} gas
 * @param {number[]} cost
 * @return {number}
 */
var canCompleteCircuit = function(gas, cost) {
  const len = gas.length
  let spare = 0
  let minSpare = Infinity
  let minIndex = 0

  for (let i =  0; i < len; i++) {
    spare += gas[i] - cost[i]
    if (spare < minSpare) {
      minSpare = spare
      minIndex = i
    }
  }

  return spare < 0 ? -1: (minIndex+1)%len
};
// @lc code=end

