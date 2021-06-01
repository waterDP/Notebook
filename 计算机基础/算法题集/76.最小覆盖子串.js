/*
 * @lc app=leetcode.cn id=76 lang=javascript
 *
 * [76] 最小覆盖子串
 */

// @lc code=start
/**
 * @param {string} s
 * @param {string} t
 * @return {string}
 */
var minWindow = function(s, t) {
  let minLen = s.length + 1
  let start = s.length    // 结果子串的起始位置
  let map = {}            // 存储目标字符和对应的缺失个数
  let missingType = 0;     // 当前缺失的字符种类数
  for (const c of t) {      // t为baac的话，map为{a:2,b:1,c:1}
    if (!map[c]) {
      missingType++        // 需要找齐的种类数 +1
      map[c] = 1
    } else {
      map[c]++
    }
  }
  
  let l = 0, r = 0               // 左右指针
  for (; r < s.length; r++) {      // 主旋律扩张窗口，超出s串就结束
    let rightChar = s[r]         // 获取right指向的新字符
    if (map[rightChar] !== undefined) map[rightChar]-- // 是目标字符，它的缺失个数-1
    if (map[rightChar] == 0) missingType--  // 它的缺失个数新变为0，缺失的种类数就-1
    while (missingType == 0) {                // 当前窗口包含所有字符的前提下，尽量收缩窗口
      if (r - l + 1 < minLen) {    // 窗口宽度如果比minLen小，就更新minLen
        minLen = r - l + 1
        start = l               // 更新最小窗口的起点
      }
      let leftChar = s[l];         // 左指针要右移，左指针指向的字符要被丢弃
      if (map[leftChar] !== undefined) map[leftChar]++ // 被舍弃的是目标字符，缺失个数+1
      if (map[leftChar] > 0) missingType++      // 如果缺失个数新变为>0，缺失的种类+1
      l++;                          // 左指针要右移 收缩窗口
    }
  }
  if (start == s.length) return ""
  return s.substring(start, start + minLen) // 根据起点和minLen截取子串
}

minWindow('acbbaca', 'aba')

// @lc code=end

