'''
Author: water.li
Date: 2022-10-10 21:54:33
Description: 利用递归 简化代码
FilePath: \note\LeetCode\21.合并两个有序链表.py
'''
#
# @lc app=leetcode.cn id=21 lang=python3
#
# [21] 合并两个有序链表
#
# https://leetcode.cn/problems/merge-two-sorted-lists/description/
#
# algorithms
# Easy (66.73%)
# Likes:    2726
# Dislikes: 0
# Total Accepted:    1.2M
# Total Submissions: 1.8M
# Testcase Example:  '[1,2,4]\n[1,3,4]'
#
# 将两个升序链表合并为一个新的 升序 链表并返回。新链表是通过拼接给定的两个链表的所有节点组成的。 
#
#
#
# 示例 1：
#
#
# 输入：l1 = [1,2,4], l2 = [1,3,4]
# 输出：[1,1,2,3,4,4]
#
#
# 示例 2：
#
#
# 输入：l1 = [], l2 = []
# 输出：[]
#
#
# 示例 3：
#
#
# 输入：l1 = [], l2 = [0]
# 输出：[0]
#
#
#
#
# 提示：
#
#
# 两个链表的节点数目范围是 [0, 50]
# -100
# l1 和 l2 均按 非递减顺序 排列
#
#
#

# @lc code=start
# Definition for singly-linked list.
# class ListNode:
#     def __init__(self, val=0, next=None):
#         self.val = val
#         self.next = next


class Solution:
  def mergeTwoLists(self, l1: Optional[ListNode], l2: Optional[ListNode]) -> Optional[ListNode]:
    if l1 is None:
      return l2
    elif l2 is None:
      return l1
    elif l1.val < l2.val:
      l1.next = self.mergeTwoLists(l1.next, l2)
      return l1
    else:
      l2.next = self.mergeTwoLists(l1, l2.next)
      return l2

    # @lc code=end
