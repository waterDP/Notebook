/*
 * @lc app=leetcode.cn id=92 lang=javascript
 *
 * [92] 反转链表 II
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
 * @param {number} left
 * @param {number} right
 * @return {ListNode}
 */
var reverseBetween = function(head, left, right) {
  const dummyHead = new ListNode(0, head)
  let g = dummyHead, p = dummyHead.next

  let step = 0 
  while(step < left-1) {
    g = g.next
    p = p.next
    step++
  }

  for (let i = 0; i < right - left; i++) {
    let temp = p.next
    p.next = p.next.next 
    temp.next = g.next
    g.next = temp
  }
  return dummyHead.next
};
// @lc code=end

