/*
 * @lc app=leetcode.cn id=206 lang=javascript
 *
 * [206] 反转链表
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
 * todo 方法一 迭代
 * @param {ListNode} head
 * @return {ListNode}
 */
var reverseList = function(head) {
  let prev = null
  let curr = head 
  while(curr) {
    const next = curr.next
    curr.next = prev
    prev = curr
    curr = next
  }
  return prev
};


/**
 * todo 方法二 递归
 * @param {ListNode} head
 * @return {ListNode}
 */
var reverseList = function(head) {
  if (head == null || head.next == null) {
    return head
  }
  const newHead = reverseList(head.next)
  head.next.next = head
  head.next = null
  return newHead
}

/**
 * todo 方法三 头插法
 * @param {ListNode} head
 * @return {ListNode}
 */
var reverseList = function(head) {
  if (head == null || head.next == null) {
    return head
  }
  let newHead = new ListNode(null) 
  let curr = head
  while (curr) {
    const next = curr.next
    curr.next = newHead.next
    newHead.next = curr
    curr = next
  }
  return newHead.next
}
// @lc code=end

