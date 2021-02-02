/*
 * @lc app=leetcode.cn id=150 lang=javascript
 *
 * [150] 逆波兰表达式求值
 */

/**
 * @param {string[]} tokens
 * @return {number}
 */
var evalRPN = function(tokens) {
  const SIGN = {
    '+': (a, b) => a + b,
    '-': (a, b) => a - b,
    '*': (a, b) => a * b,
    '/': (a, b) => parseInt(a / b, 10)
  }
  let fun = () => {
    let char = tokens.pop()
    if (SIGN[char]) {
      let num = fun()
      return SIGN[char](fun(), num)
    } else {
      return parseInt(char, 10)
    }
  }

  return fun()
};
// @lc code=end

