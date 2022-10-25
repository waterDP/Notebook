/*
 * @lc app=leetcode.cn id=28 lang=javascript
 *
 * [28] 找出字符串中第一个匹配项的下标
 *
 * https://leetcode.cn/problems/find-the-index-of-the-first-occurrence-in-a-string/description/
 *
 * algorithms
 * Medium (41.47%)
 * Likes:    1622
 * Dislikes: 0
 * Total Accepted:    754.5K
 * Total Submissions: 1.8M
 * Testcase Example:  '"sadbutsad"\n"sad"'
 *
 * 给你两个字符串 haystack 和 needle ，请你在 haystack 字符串中找出 needle 字符串的第一个匹配项的下标（下标从 0
 * 开始）。如果 needle 不是 haystack 的一部分，则返回  -1 。
 * 
 * 
 * 
 * 示例 1：
 * 
 * 
 * 输入：haystack = "sadbutsad", needle = "sad"
 * 输出：0
 * 解释："sad" 在下标 0 和 6 处匹配。
 * 第一个匹配项的下标是 0 ，所以返回 0 。
 * 
 * 
 * 示例 2：
 * 
 * 
 * 输入：haystack = "leetcode", needle = "leeto"
 * 输出：-1
 * 解释："leeto" 没有在 "leetcode" 中出现，所以返回 -1 。
 * 
 * 
 * 
 * 
 * 提示：
 * 
 * 
 * 1 <= haystack.length, needle.length <= 10^4
 * haystack 和 needle 仅由小写英文字符组成
 * 
 * 
 */

// @lc code=start
/**
 * @param {string} haystack
 * @param {string} needle
 * @return {number}
 * @description KMP
 */
var strStr = function(haystack, needle) {
  if (needle === '') return 0
  let hi = ne = 0
  const nexts = getNext(needle)
  while (hi < haystack.length) {
    if (ne === -1 || haystack[hi] === needle[ne]) {
      if (ne === needle.length - 1) return hi - needle.length + 1
      hi++
      ne++
    } else {
      ne = nexts[ne]
    }
  }
  return -1
};

function getNext(needle) {
  let i = 0, j = -1, next = [-1]
  while(i < needle.length) {
    if (j === -1 || needle[i] === needle[j]) {
      next[++i] = ++j 
    } else {
      j = next[j]
    }
  }
  return next
}
// @lc code=end

