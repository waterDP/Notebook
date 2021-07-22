/*
 * @lc app=leetcode.cn id=1309 lang=javascript
 *
 * [1309] 解码字母到整数映射
 */

// @lc code=start
/**
 * @param {string} s
 * @return {string}
 */
var freqAlphabets = function(s) {
  let pos = 0
  let ret = ''
  let map = '#abcdefghijklmnopqrstuvwxyz'
  while (pos < s.length) {
    if(s[pos + 2] == '#') {
      ret += map[s.substr(pos, 2)]
      pos += 3
    } else {
      ret += map[s[pos]]
      pos++
    }
  }
  return ret
};
// @lc code=end

