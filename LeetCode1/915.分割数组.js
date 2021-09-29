/*
 * @lc app=leetcode.cn id=915 lang=javascript
 *
 * [915] 分割数组
 */

// @lc code=start
/**
 * @param {number[]} A
 * @return {number}
 */
var partitionDisjoint = function(A) {
  let n = A.length, left = new Array(n), right = new Array(n)
  left[0] = A[0]
  right[n-1]=A[n-1]

  for (let i = 1; i < n; i++) {
    left[i] = Math.max(left[i-1], A[i-1])
  }
  for (let i = n - 2; i >= 0; i--) {
    right[i] = Math.min(right[i+1], A[i+1])
  }
  for (let i = 0; i < n; i++) {
    if (right[i] > left[i]) {
      return i + 1
    }
  }
}; 
// @lc code=end

