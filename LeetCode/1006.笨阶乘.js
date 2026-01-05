/*
 * @Author: water.li
 * @Date: 2023-04-07 20:32:28
 * @Description: 
 * @FilePath: \Notebook\LeetCode\1006.笨阶乘.js
 */
/*
 * @lc app=leetcode.cn id=1006 lang=javascript
 *
 * [1006] 笨阶乘
 */

// @lc code=start
/**
 * @param {number} N
 * @return {number}
 */
var clumsy = function (N) {
  const stack = [N--]

  let index = 0 // 用于控制乘除加减
  while (N > 0) {
    if (index === 0) {
      stack.push(stack.pop() * N)
    } else if (index === 1) {
      const cur = stack.pop()
      stack.push(cur > 0 ? Math.floor(cur / N) : Math.ceil(cur / N))
    } else if (index === 2) {
      stack.push(N)
    } else {
      stack.push(-N)
    }
    N--
    index = (index + 1) % 4
  }
  // 求和栈中的所有的元素
  return stack.reduce((s, c) => s + c)
};
// @lc code=end

