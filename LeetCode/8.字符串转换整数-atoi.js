/*
 * @Author: water.li
 * @Date: 2022-03-24 23:01:07
 * @Description: 
 * @FilePath: \notebook\LeetCode\8.字符串转换整数-atoi.js
 */
/*
 * @lc app=leetcode.cn id=8 lang=javascript
 *
 * [8] 字符串转换整数 (atoi)
 */

// @lc code=start
/**
 * @param {string} s
 * @return {number}
 */
var myAtoi = function(s) {
  class Automaton {
    constructor() {
      this.state = 'start'
      this.sign = 1 // 符号位，默认为1即为正
      this.answer = 0
      this.map = new Map([
        ['start', ['start', 'signed', 'in_number', 'end']],
        ['signed', ['end', 'end', 'in_number', 'end']],
        ['in_number', ['end', 'end', 'in_number', 'end']],
        ['end', ['end', 'end', 'end', 'end']]
      ])
    }

    getIndex(char) {
      if (char === ' ') {
        // 空格判断
        return 0
      }
      if (char === '-' || char === '+') {
        // 正负判断
        return 1
      }
      if (typeof Number(char) === 'number' && !isNaN(char)) {
        // 数值判断
        return 2
      }
      return 3
    }

    get(char) {
      this.state = this.map.get(this.state)[this.getIndex(char)]
      if (this.state === 'in_number') {
        this.answer = this.answer*10 + (char - 0)
        this.answer = 
          this.sign === 1 
          ? Math.min(this.answer, Math.pow(2, 31) - 1)
          : Math.min(this.answer, -Math.pow(-2, 31))
      } else if (this.state === 'signed') {
        this.sign = char === '+' ? 1 : -1
      }
    }
  }

  const automaton = new Automaton()

  for (let char of s) {
    automaton.get(char)
  }
  return automaton.sign * automaton.answer
};
// @lc code=end

