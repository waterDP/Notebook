/*
 * @Author: water.li
 * @Date: 2022-03-28 21:47:08
 * @Description:
 * @FilePath: \notebook\LeetCode\234.回文链表.js
 */
/*
 * @lc app=leetcode.cn id=234 lang=javascript
 *
 * [234] 回文链表
 *
 * https://leetcode-cn.com/problems/palindrome-linked-list/description/
 *
 * algorithms
 * Easy (51.10%)
 * Likes:    1323
 * Dislikes: 0
 * Total Accepted:    397.8K
 * Total Submissions: 778.1K
 * Testcase Example:  '[1,2,2,1]'
 *
 * 给你一个单链表的头节点 head ，请你判断该链表是否为回文链表。如果是，返回 true ；否则，返回 false 。
 * 
 * 
 * 
 * 示例 1：
 * 
 * 
 * 输入：head = [1,2,2,1]
 * 输出：true
 * 
 * 
 * 示例 2：
 * 
 * 
 * 输入：head = [1,2]
 * 输出：false
 * 
 * 
 * 
 * 
 * 提示：
 * 
 * 
 * 链表中节点数目在范围[1, 10^5] 内
 * 0 <= Node.val <= 9
 * 
 * 
 * 
 * 
 * 进阶：你能否用 O(n) 时间复杂度和 O(1) 空间复杂度解决此题？
 * 
 */

// @lc code=start
/**
 * Definition for singly-linked list.
 * function ListNode(val, next) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.next = (next===undefined ? null : next)
 * }
 */
/**
 * @param {ListNode} head
 * @return {boolean}
 */
var isPalindrome = function(head) {
  const mod = 1000000007, base = 11
  let left = 0, right = 0, t = head, mul = 1
  while (t) {
    left = (left * base + t.val) % mod
    right = (right + t.val * mul) % mod
    mul = mul * base % mod
    t = t.next
  }
  return left === right
};
// @lc code=end

