/*
 * @lc app=leetcode.cn id=82 lang=javascript
 *
 * [82] 删除排序链表中的重复元素 II
 *
 * https://leetcode-cn.com/problems/remove-duplicates-from-sorted-list-ii/description/
 *
 * algorithms
 * Medium (50.21%)
 * Likes:    450
 * Dislikes: 0
 * Total Accepted:    85.1K
 * Total Submissions: 169.3K
 * Testcase Example:  '[1,2,3,3,4,4,5]'
 *
 * 给定一个排序链表，删除所有含有重复数字的节点，只保留原始链表中 没有重复出现 的数字。
 * 
 * 示例 1:
 * 
 * 输入: 1->2->3->3->4->4->5
 * 输出: 1->2->5
 * 
 * 
 * 示例 2:
 * 
 * 输入: 1->1->1->2->3
 * 输出: 2->3
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
 * @return {ListNode}
 */
var deleteDuplicates = function(head) {
  let node = new ListNode('head')
  let resNode = new ListNode('reshead')
  node.next = head
  resNode.next = node
  while(node.next) {
    if (!node.next.next) break
    if (node.next.val === node.next.next.val) {
      let temp = node.next
      while(temp && temp.val === node.next.val) {
        temp = temp.next
      }
      node.next = temp
    } else {
      node = node.next
    }
  }
  return resNode.next.next
};
// @lc code=end

