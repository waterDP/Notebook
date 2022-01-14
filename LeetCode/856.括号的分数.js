/*
 * @Author: water.li
 * @Date: 2022-01-14 22:54:52
 * @Description: 
 * @FilePath: \notebook\LeetCode\856.括号的分数.js
 */
/*
 * @lc app=leetcode.cn id=856 lang=javascript
 *
 * [856] 括号的分数
 *
 * https://leetcode-cn.com/problems/score-of-parentheses/description/
 *
 * algorithms
 * Medium (62.94%)
 * Likes:    261
 * Dislikes: 0
 * Total Accepted:    17.4K
 * Total Submissions: 27.7K
 * Testcase Example:  '"()"'
 *
 * 给定一个平衡括号字符串 S，按下述规则计算该字符串的分数：
 * 
 * 
 * () 得 1 分。
 * AB 得 A + B 分，其中 A 和 B 是平衡括号字符串。
 * (A) 得 2 * A 分，其中 A 是平衡括号字符串。
 * 
 * 
 * 
 * 
 * 示例 1：
 * 
 * 输入： "()"
 * 输出： 1
 * 
 * 
 * 示例 2：
 * 
 * 输入： "(())"
 * 输出： 2
 * 
 * 
 * 示例 3：
 * 
 * 输入： "()()"
 * 输出： 2
 * 
 * 
 * 示例 4：
 * 
 * 输入： "(()(()))"
 * 输出： 6
 * 
 * 
 * 
 * 
 * 提示：
 * 
 * 
 * S 是平衡括号字符串，且只含有 ( 和 ) 。
 * 2 <= S.length <= 50
 * 
 * 
 */

// @lc code=start
/**
 * @param {string} s
 * @return {number}
 */
var scoreOfParentheses = function(s) {
  const stack = []
  for (let si of s) {
    if (si === '(') {
      stack.push(si)
    } else if (stack[stack.length - 1] === '(') {
      stack[stack.length-1] = 1
    } else {
      let a = stack.pop()
      let sum = 0
      while (a !== '(') {
        sum += a
        a = stack.pop()
      }
      stack.push(sum * 2)
    }
  }
  return stack.reduce((sum, item) => {
    sum += item
    return sum
  })
};
// @lc code=end

