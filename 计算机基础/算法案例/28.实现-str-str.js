/*
 * @lc app=leetcode.cn id=28 lang=javascript
 *
 * [28] 实现 strStr()
 */

// @lc code=start
/**
 * @param {string} haystack
 * @param {string} needle
 * @return {number}
 */
var strStr = function (haystack, needle) {
  if (needle == "") return 0
  let next = getNext(needle)
  let hi = 0;
  let ne = 0;
  while (hi < haystack.length) {
    if (ne == -1 || haystack[hi] == needle[ne]) {//相等情况
      if (ne == needle.length - 1) return (hi - needle.length + 1)
      hi++
      ne++
    } else {//失配情况
      ne = next[ne]
    }
  }
  return -1
};

function getNext(needle) {
  let i = 0, j = -1, next = [-1]
  while (i < needle.length) {
    if (j == -1 || needle[i] == needle[j]) {
      next[++i] = ++j
    } else {
      j = next[j]//回溯
    }
  }
  return next
}
// @lc code=end

