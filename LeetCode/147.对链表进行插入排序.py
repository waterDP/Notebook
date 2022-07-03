'''
Author: water.li
Date: 2022-07-03 22:28:29
LastEditors: water.li
LastEditTime: 2022-07-03 22:51:05
FilePath: \note\LeetCode\147.对链表进行插入排序.py
'''
#
# @lc app=leetcode.cn id=147 lang=python3
#
# [147] 对链表进行插入排序
#

# @lc code=start
# Definition for singly-linked list.
# class ListNode:
#     def __init__(self, val=0, next=None):
#         self.val = val
#         self.next = next
class Solution:
  def insertionSortList(self, head: ListNode) -> ListNode:
    if not head:
      return head
    
    dummyHead = ListNode(0)
    dummyHead.next = head
    lastSorted = head
    curr = head.next
    
    while curr:
      if lastSorted.val <= curr.val:
        lastSorted = lastSorted.next
      else:
        prev = dummyHead
        while prev.next.val <= curr.val:
          prev = prev.next
          
        lastSorted.next = curr.next
        curr.next = prev.next
        prev.next = curr
      curr = lastSorted.next  
    return dummyHead.next  
# @lc code=end

