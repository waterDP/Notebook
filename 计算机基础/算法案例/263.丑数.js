/*
 * @lc app=leetcode.cn id=263 lang=javascript
 *
 * [263] 丑数
 */

// @lc code=start
/**
 * @param {number} num
 * @return {boolean}
 */
var isUgly = function(num) {
  let arr = [2, 3, 5]
  for(let a of arr){
    while(num % a === 0 && num > 1) num /= a
  }
  return num === 1
};
// @lc code=end

