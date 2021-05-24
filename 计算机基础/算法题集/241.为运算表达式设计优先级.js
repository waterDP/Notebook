/*
 * @lc app=leetcode.cn id=241 lang=javascript
 *
 * [241] 为运算表达式设计优先级
 */

// @lc code=start
/**
 * @param {string} expression
 * @return {number[]}
 */
var diffWaysToCompute = function (expression) {
  const isNumber = str => /^\d+$/i.test(str)
  const operate = (a, b, o) => {
    const map = {
      '+': () => a + b,
      '-': () => a - b,
      '*': () => a * b
    }
    return map[o]()
  }

  const partition = (tokens, l, r) => {
    const str = tokens.slice(l, r + 1).join('')
    if (isNumber(str)) {
      return [Number(str)]
    }
    const res = []
    for (let i = l; i < r; i++) {
      if (!isNumber(tokens[i])) {
        const left = partition(tokens, l, i - 1)
        const right = partition(tokens, i + 1, r)
        for (const num1 of left) {
          for (const num2 of right) {
            res.push(operate(num1, num2, tokens[i]))
          }
        }
      }
    }
    return res
  }

  return partition(expression.split(''), 0, expression.length - 1)
};
// @lc code=end

