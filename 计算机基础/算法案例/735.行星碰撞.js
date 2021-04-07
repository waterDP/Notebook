/*
 * @lc app=leetcode.cn id=735 lang=javascript
 *
 * [735] 行星碰撞
 */

// @lc code=start
/**
 * @param {number[]} asteroids
 * @return {number[]}
 */
var asteroidCollision = function(asteroids) {
  const len = asteroids.length
  const ret = []
  for (let i = 0; i < len; i++) {
    const aster = asteroids[i]
    if (!ret.length) {
      ret.push(aster)
    } else {
      const pop = ret[ret.length - 1]
      if (pop < 0 || aster > 0) {
        ret.push(aster)
      } else {
        if (pop + aster > 0) {
          continue
        } else if (pop + aster < 0) {
          ret.pop()
          i--
        } else {
          ret.pop()
        }
      }
    }
  }
  return ret
};
// @lc code=end

