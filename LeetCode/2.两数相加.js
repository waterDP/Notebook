/*
 * @Author: water.li
 * @Date: 2021-09-29 22:34:31
 * @Description: 
 * @FilePath: \notebook\LeetCode\2.两数相加.js
 */
/*
 * @lc app=leetcode.cn id=2 lang=javascript
 *
 * [2] 两数相加
 */

// @lc code=start
/**
 * Definition for singly-linked list.
 * function ListNode(val) {
 *     this.val = val;
 *     this.next = null;
 * }
 */
/**
 * @param {ListNode} l1
 * @param {ListNode} l2
 * @return {ListNode}
 */
var addTwoNumbers = function (l1, l2) {
  let head = null, tail = null
  let carry = 0
  while (l1 || l2) {
    const n1 = l1 ? l1.val : 0
    const n2 = l2 ? l2.val : 0
    const sum = n1 + n2 + carry
    if (!head) {
      head = tail = new ListNode(sum % 10)
    } else {
      tail.next = new ListNode(sum % 10)
      tail = tail.next
    }
    carry = Math.floor(sum / 10)
    l1 && (l1 = l1.next)
    l2 && (l2 = l2.next)
  }
  if (carry > 0) {
    tail.next = new ListNode(carry)
  }
  return head
};
// @lc code=end


