/*
 * @lc app=leetcode.cn id=38 lang=javascript
 *
 * [38] 外观数列
 */

// @lc code=start
/**
 * @param {number} n
 * @return {string}
 */
var countAndSay = function(n) {
  const find = n => {
    if (n === 1) {
      return '1'
    }
    let cache = {}
    let temp = find(n - 1).split('')
    let res = ''
    for (let idx = 0; idx < temp.length; idx++) {
      cache[temp[idx]] = 
        typeof cache[temp[idx]] === 'number' ? cache[temp[idx]] + 1 : 1
      if (temp[idx] !== temp[idx + 1] || !temp[idx + 1]) {
        res = res + cache[temp[idx]] + temp[idx]
        delete cache[temp[idx]]
      }
    }
    return res
  }
  return find(n)
};
// @lc code=end

