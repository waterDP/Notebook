/*
 * @lc app=leetcode.cn id=402 lang=javascript
 *
 * [402] 移掉K位数字
 */

// @lc code=start
/**
 * @param {string} num
 * @param {number} k
 * @return {string}
 */
var removeKdigits = function(num, k) {
  const stk = []
  for (const digit of num) {
    while (stk.length > 0 && stk[stk.length - 1] > digit && k) {
      stk.pop()
      k -= 1
    }
    stk.push(digit)
  }

  while(k--) {
    stk.pop()
  } 

  let ans = ''
  let isLeadingZero = true
  for (const digit of stk) {
    if (isLeadingZero && digit === '0') continue
    isLeadingZero = false
    ans += digit
  }
  return ans === '' ? '0': ans
};
// @lc code=end

