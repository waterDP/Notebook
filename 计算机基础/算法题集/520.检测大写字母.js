/*
 * @lc app=leetcode.cn id=520 lang=javascript
 *
 * [520] 检测大写字母
 */

// @lc code=start
/**
 * @param {string} word
 * @return {boolean}
 * 反向遍历，分别处理大小写两种情况。
 * 当遇到小写字母时，需要保证还没遇到过大写字母，否则类似 FlaG 情况，不合法。
 * 当遇到大写字母时，需要保证小写没有同时出现过，都出现过则类似 USa，不合法。
 * 其他情况均为合法大小写。
 * 复杂度依然为 O(N)，但在遇到不合法情况可以提前返回，实际效率会比统计高一些
 */
var detectCapitalUse = function(word) {
  let upperFound = lowerFound = false
  for (let i = word.length-1; i >= 0; i--) {
    if (word[i] >= 'A' && word[i] <= 'Z') {
      if (upperFound && lowerFound) {
        return false
      }
      upperFound = true
    } else {
      if (upperFound) {
        return false
      }
      lowerFound = true
    }
  }
  return true
};
// @lc code=end


// @after-stub-for-debug-begin
module.exports = detectCapitalUse;
// @after-stub-for-debug-end