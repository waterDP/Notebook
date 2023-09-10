/*
 * @Author: water.li
 * @Date: 2021-09-29 22:34:31
 * @Description:
 * @FilePath: \Notebook\LeetCode\20.有效的括号.js
 */
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
var isValid = function (s) {
  let stack = [];
  let len = s.length;
  if (len % 2) return false;
  const lefts = "{[(";
  const matchs = ["()", "[]", "{}"];
  for (let i = 0; i < len; i++) {
    const item = s[i];
    if (lefts.includes(item)) {
      stack.push(item);
    } else {
      const top = stack.pop();
      if (!matchs.includes(top + item)) {
        return false;
      }
    }
  }
  return !stack.length;
};
// @lc code=end
