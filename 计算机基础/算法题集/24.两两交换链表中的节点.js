/*
 * @lc app=leetcode.cn id=24 lang=javascript
 *
 * [24] 两两交换链表中的节点
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
 * @return {ListNode}
 */
var swapPairs = function(head) {
  let l = head, r = (l && l.next), pre
  r && (head = r)
  while (r) {
    l.next = r.next
    r.next = l
    pre && (pre.next = r)
    pre = l
    l = l.next
    r = (l && l.next)
  }
  return head
};
// @lc code=end
