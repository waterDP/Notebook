 /*
 * @lc app=leetcode.cn id=61 lang=javascript
 *
 * [61] 旋转链表
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
 * @param {number} k
 * @return {ListNode}
 */
var rotateRight = function(head, k) {
  if (head == null) {
    return head
  }
  
  let len = 0
  let item = head
  while(item) {
    len++
    item = item.next
  }
  k = k % len
  
  let fast = head
  let slow = head
  for (let i = 0; i < k; i++) {
    fast = fast.next
  }
  while(fast.next) {
    fast = fast.next
    slow = slow.next
  }
  fast.next = head
  head = slow.next
  slow.next = null
  
  return head
};
// @lc code=end

