/*
 * @lc app=leetcode.cn id=20 lang=javascript
 *
 * [20] 有效的括号
 */

// @lc code=start
/**
 * @param {string} s
 * @return {boolean}
 */
var isValid = function(s) {
  let stack = []
  let len = s.length
  if (len%2) return false
  let lefts = '{[('
  for (let i = 0; i < len; i++) {
    const item = s[i]
    if (lefts.includes(item)) {
      stack.push(item)
    } else {
      const top = stack.pop()
      switch(item) {
        case ')': 
          if (top !== '(') return false
          break
        case ']':
          if (top !== '[') return false
          break
        case  '}':
          if (top !== '{') return false 
          break
        default: 
          return false
      }
    }
  }
  return !stack.length
}
// @lc code=end

