/*
 * @Author: water.li
 * @Date: 2022-02-08 19:49:22
 * @Description: 
 * @FilePath: \notebook\LeetCode\32.最长有效括号.js
 */
/*
 * @lc app=leetcode.cn id=32 lang=javascript
 *
 * [32] 最长有效括号
 *
 * https://leetcode-cn.com/problems/longest-valid-parentheses/description/
 *
 * algorithms
 * Hard (35.88%)
 * Likes:    1638
 * Dislikes: 0
 * Total Accepted:    222.1K
 * Total Submissions: 618.4K
 * Testcase Example:  '"(()"'
 *
 * 给你一个只包含 '(' 和 ')' 的字符串，找出最长有效（格式正确且连续）括号子串的长度。
 * 
 * 
 * 
 * 
 * 
 * 示例 1：
 * 
 * 
 * 输入：s = "(()"
 * 输出：2
 * 解释：最长有效括号子串是 "()"
 * 
 * 
 * 示例 2：
 * 
 * 
 * 输入：s = ")()())"
 * 输出：4
 * 解释：最长有效括号子串是 "()()"
 * 
 * 
 * 示例 3：
 * 
 * 
 * 输入：s = ""
 * 输出：0
 * 
 * 
 * 
 * 
 * 提示：
 * 
 * 
 * 0 
 * s[i] 为 '(' 或 ')'
 * 
 * 
 * 
 * 
 */

// @lc code=start
/**
 * @param {string} s
 * @return {number}
 */
var longestValidParentheses = function(s) {
  let maxAns = 0, stack = [-1], len = s.length
  for (let i = 0; i < len; i++) {
    if (s[i] === "(") {
      stack.push(i)
    } else {
      stack.pop()
      if (stack.length) {
        maxAns = Math.max(maxAns, i - stack[stack.length - 1])
      } else {
        stack.push(i)
      }
    }
  }
  return maxAns
};
// @lc code=end

