/*
 * @lc app=leetcode.cn id=500 lang=javascript
 *
 * [500] 键盘行
 */

// @lc code=start
/**
 * @param {string[]} words
 * @return {string[]}
 */
var findWords = function(words) {
  let obj = {
    q:0, w:0, e:0, r:0, t:0, y:0, u:0, i:0, o:0, p:0,
    a:1, s:1, d:1, f:1, g:1, h:1, j:1, k:1, l:1,
    z:2, x:2, c:2, v:2, b:2, n:2, m:2
  }
  return words.filter(item => {
    item = item.toLocaleLowerCase()
    let num = obj[item[0]]
    return item.split('').every(t => obj[t] === num)
  })
};
// @lc code=end

