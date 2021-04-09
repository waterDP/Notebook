/*
 * @lc app=leetcode.cn id=367 lang=javascript
 *
 * [367] 有效的完全平方数
 *
 * https://leetcode-cn.com/problems/valid-perfect-square/description/
 *
 * algorithms
 * Easy (43.72%)
 * Likes:    194
 * Dislikes: 0
 * Total Accepted:    55.9K
 * Total Submissions: 127.9K
 * Testcase Example:  '16'
 *
 * 给定一个正整数 num，编写一个函数，如果 num 是一个完全平方数，则返回 True，否则返回 False。
 * 
 * 说明：不要使用任何内置的库函数，如  sqrt。
 * 
 * 示例 1：
 * 
 * 输入：16
 * 输出：True
 * 
 * 示例 2：
 * 
 * 输入：14
 * 输出：False
 * 
 * 
 */

// @lc code=start
/**
 * 任意一个平方数都可以表示出下面的奇数序列和
 * 1+3+5+7+...+(2N-1) = N^2
 * @param {number} num
 * @return {boolean}
 */
var isPerfectSquare = function(num) {
  if (num < 2) {
    return true
  }
  let temp = 1
  while (num > 0) {
    num -= temp
    temp += 2
  }
  return num === 0
};
// @lc code=end

