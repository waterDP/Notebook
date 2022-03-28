/*
 * @Author: water.li
 * @Date: 2022-03-28 21:54:49
 * @Description: 
 * @FilePath: \notebook\LeetCode\693.交替位二进制数.js
 */
/*
 * @lc app=leetcode.cn id=693 lang=javascript
 *
 * [693] 交替位二进制数
 *
 * https://leetcode-cn.com/problems/binary-number-with-alternating-bits/description/
 *
 * algorithms
 * Easy (60.82%)
 * Likes:    186
 * Dislikes: 0
 * Total Accepted:    61.3K
 * Total Submissions: 94.1K
 * Testcase Example:  '5'
 *
 * 给定一个正整数，检查它的二进制表示是否总是 0、1 交替出现：换句话说，就是二进制表示中相邻两位的数字永不相同。
 * 
 * 
 * 
 * 示例 1：
 * 
 * 
 * 输入：n = 5
 * 输出：true
 * 解释：5 的二进制表示是：101
 * 
 * 
 * 示例 2：
 * 
 * 
 * 输入：n = 7
 * 输出：false
 * 解释：7 的二进制表示是：111.
 * 
 * 示例 3：
 * 
 * 
 * 输入：n = 11
 * 输出：false
 * 解释：11 的二进制表示是：1011.
 * 
 * 
 * 
 * 提示：
 * 
 * 
 * 1 <= n <= 2^31 - 1
 * 
 * 
 */

/* * 
 * 对输入 n 的二进制表示右移一位后，得到的数字再与 n 按位异或得到 a。
 * 当且仅当输入n为交替位二进制数时，a 的二进制表示全为 1（不包括前导 0）。
 * 这里进行简单证明：当 a 的某一位为1时，当且仅当n的对应位和其前一位相异。
 * 当 a的每一位为 1 时，当且仅当 n 的所有相邻位相异，即n为交替位二进制数。
 * 
 * 将a与a+1按位与，
 * 当且仅当a的二进制表示全为1时，结果为 0。
 * 这里进行简单证明：当且仅当a的二进制表示全为1时，a + 1可以进位，并将原最高位置为0，
 * 按位与的结果为 0。否则，不会产生进位，两个最高位都为 1，相与结果不为 0
 */

// @lc code=start
/**
 * @param {number} n
 * @return {boolean}
 */
var hasAlternatingBits = function(n) {
  const a = n ^ (n >> 1)
  return (a & (a + 1)) === 0
};
// @lc code=end

