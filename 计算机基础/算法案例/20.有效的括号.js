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
  let arr = []
  let len = s.length
  if (len%2) return false
  let lefts = '{[('
  for (let i = 0; i < len; i++) {
    const item = s[i]
    if (lefts.includes(item)) {
      arr.push(item)
    } else {
      const top = arr.pop()
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
  return !arr.length
}
// @lc code=end

