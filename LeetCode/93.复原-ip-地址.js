/*
 * @Author: water.li
 * @Date: 2022-01-21 21:24:37
 * @Description: 
 * @FilePath: \notebook\LeetCode\93.复原-ip-地址.js
 */
/*
 * @lc app=leetcode.cn id=93 lang=javascript
 *
 * [93] 复原 IP 地址
 *
 * https://leetcode-cn.com/problems/restore-ip-addresses/description/
 *
 * algorithms
 * Medium (54.84%)
 * Likes:    773
 * Dislikes: 0
 * Total Accepted:    178.5K
 * Total Submissions: 324.8K
 * Testcase Example:  '"25525511135"'
 *
 * 有效 IP 地址 正好由四个整数（每个整数位于 0 到 255 之间组成，且不能含有前导 0），整数之间用 '.' 分隔。
 * 
 * 
 * 例如："0.1.2.201" 和 "192.168.1.1" 是 有效 IP 地址，但是 "0.011.255.245"、"192.168.1.312"
 * 和 "192.168@1.1" 是 无效 IP 地址。
 * 
 * 
 * 给定一个只包含数字的字符串 s ，用以表示一个 IP 地址，返回所有可能的有效 IP 地址，这些地址可以通过在 s 中插入 '.'
 * 来形成。你不能重新排序或删除 s 中的任何数字。你可以按 任何 顺序返回答案。
 * 
 * 
 * 
 * 示例 1：
 * 
 * 
 * 输入：s = "25525511135"
 * 输出：["255.255.11.135","255.255.111.35"]
 * 
 * 
 * 示例 2：
 * 
 * 
 * 输入：s = "0000"
 * 输出：["0.0.0.0"]
 * 
 * 
 * 示例 3：
 * 
 * 
 * 输入：s = "1111"
 * 输出：["1.1.1.1"]
 * 
 * 
 * 示例 4：
 * 
 * 
 * 输入：s = "010010"
 * 输出：["0.10.0.10","0.100.1.0"]
 * 
 * 
 * 示例 5：
 * 
 * 
 * 输入：s = "101023"
 * 输出：["1.0.10.23","1.0.102.3","10.1.0.23","10.10.2.3","101.0.2.3"]
 * 
 * 
 * 
 * 
 * 提示：
 * 
 * 
 * 0 <= s.length <= 20
 * s 仅由数字组成
 * 
 * 
 */

// @lc code=start
/**
 * @param {string} s
 * @return {string[]}
 */
var restoreIpAddresses = function(s) {
  const res = []
  helper = (i = 0, path = [], count = 0) => {
    if (count === s.length) {
      path.length === 4 && res.push(path.join('.'))
      return 
    }
    if (path[path.length - 1] === '0') {
      helper(i+1, [...path, s[i]], count+1) 
    } else {
      helper(i+1, [...path, s[i]], count + 1)
      if (parseInt(path[path.length-1]+s[i]) <= 255) {
        let pre = path.slice(0, path.length-1)
        helper(i+1, [...pre, path[path.length-1]+s[i]], count+1)
      }
    }
  }
  helper()
  return res
};

// @lc code=end

