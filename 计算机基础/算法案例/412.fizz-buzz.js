/*
 * @lc app=leetcode.cn id=412 lang=javascript
 *
 * [412] Fizz Buzz
 */

// @lc code=start
/**
 * @param {number} n
 * @return {string[]}
 */
var fizzBuzz = function(n) {
  const result = []
  for (let i = 1; i <= n; i++) {
    let current = ''
    i%3 || (current += 'Fizz')
    i%5 || (current += 'Buzz')
    current || (current += i)
    result.push(current)
  }
  return result
};
// @lc code=end

