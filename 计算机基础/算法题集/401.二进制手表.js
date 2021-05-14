/*
 * @lc app=leetcode.cn id=401 lang=javascript
 *
 * [401] 二进制手表
 */

// @lc code=start
/**
 * @param {number} nums
 * @return {string[]}
 */
var readBinaryWatch = function (nums) {
  const timeList = []
  const dfs = (time, n, index) => {
    const hour = time >> 6, minute = time & 0b111111
    if (hour > 11 || minute > 59) return
    if (n === 0) {
      timeList.push(`${hour}:${minute < 10 ? "0" + minute : minute}`)
      return
    }
    const end = 10 - n
    while (index <= end) {
      dfs(time | (1 << index), n - 1, ++index)
    }
  }
  dfs(0, nums, 0)
  return timeList
};
// @lc code=end

