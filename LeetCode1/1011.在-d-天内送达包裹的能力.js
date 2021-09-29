/*
 * @lc app=leetcode.cn id=1011 lang=javascript
 *
 * [1011] 在 D 天内送达包裹的能力
 */

// @lc code=start
/**
 * @param {number[]} weights
 * @param {number} D
 * @return {number}
 */
var shipWithinDays = function(weights, D) {
  let left = Math.max(...weights), right = weights.reduce((a, b) => a+b)
  while(left < right) {
    const mid = Math.floor((left + right) /2)
    // need为需要运送的天数
    // cur为当前这一天已经运送的包裹重量之和
    let need = 1, cur = 0
    for (const weight of weights) {
      if (cur + weight > mid) {
        need++
        cur = 0
      }
      cur += weight
    }
    if (need <= D) {
      right = mid
    } else {
      left = mid + 1
    }
  }
  return left
};
// @lc code=end

