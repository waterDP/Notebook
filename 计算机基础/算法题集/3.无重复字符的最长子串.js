/*
 * @lc app=leetcode.cn id=3 lang=javascript
 *
 * [3] 无重复字符的最长子串
 */

// @lc code=start
/**
 * @param {string} s
 * @return {number}
 */
var lengthOfLongestSubstring = function(s) {
  let l = 0 // 定义左指针
  let res = 0 // 结果
  let map = new Map() // 存放字符和对应下标
  for (let r = 0; r < s.length; ++r) {
    // 如果出现了重复字符，则把左指针移到重复字符的下一位，注意同时满足重复字符的索引大于左指针
    if (map.has(s[r]) && map.get(s[r]) >= l) {
      l = map.get(s[r]) + 1
    }
    res = Math.max(res, r-l+1)
    map.set(s[r], r)  // 在下每个字符的下标
  }
  return res
};
// @lc code=end

