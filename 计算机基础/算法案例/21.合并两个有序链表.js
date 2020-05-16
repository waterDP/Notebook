/*
 * @lc app=leetcode.cn id=21 lang=javascript
 *
 * [21] 合并两个有序链表
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
var mergeTwoLists = function(l1, l2) {
  let r = new ListNode(), rHead = r
  if (!l1) {
    return l2
  }
  if (!l2) {
    return l1
  }
  while(l1 && l2) {
    if (l1.val < l2.val) {
      r.next = l1
      l1 = l1.next
      r = r.next
    } else {
      r.next = l2 
      l2 = l2.next
      r = r.next
    }
  }
  if (l1) {
    r.next = l1
  } else if (l2) {
    r.next = l2
  }
  return rHead.next
};
// @lc code=end

