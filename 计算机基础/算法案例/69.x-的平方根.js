/*
 * @lc app=leetcode.cn id=69 lang=javascript
 *
 * [69] x 的平方根
 */

// @lc code=start
/**
 * @param {number} x
 * @return {number}
 */
const mySqrt = (x) => {
  if (x < 2) return x
  let left = 1
  let right = parseInt(x / 2)      // 除以2并取整，缩小一下遍历的范围
  while (left + 1 < right) {  // 退出循环时，它们相邻
    let mid = parseInt((left + right)/2)
    if (mid == x / mid) {
      return mid
    } else if (mid < x / mid) {
      left = mid
    } else {
      right = mid
    }
  }
  return right > x / right ? left : right
}
// @lc code=end

