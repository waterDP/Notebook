/*
 * @lc app=leetcode.cn id=1023 lang=javascript
 *
 * [1023] 驼峰式匹配
 */

// @lc code=start
/**
 * @param {string[]} queries
 * @param {string} pattern
 * @return {boolean[]}
 */
var camelMatch = function(queries, pattern) {
  let ret = []

  const nextStatus = (status, st) => {
    if (status == -2) return -2
    if (status == pattern.length - 1) { // 如果到了最后一个状态，如果是大写字母，那么匹配
      if (st >= 'A' && st <= 'Z') return -2
      return status
    }
    if (pattern[status+1] === st) { // 如果输入正好是下一个字符，那么状态转移到时下一个字符
      return status + 1
    }
    // 如果不是，并且还是大写字母，那么匹配失败，如果是小写字母状态不转移
    if (st >= 'A' && st <= 'Z') {
      return -2
    }
    return status
  }

  const check = q => {
    let status = -1 // 开始状态
    for (let st of q) {
      status = nextStatus(status, st)
      if (status == -2) return false // 错误态，则直接返回false
    }
    return status === pattern.length - 1
  }

  for (let query of queries) {
    ret.push(check(query))
  }
  return ret
};
// @lc code=end

