'''
Author: water.li
Date: 2022-06-30 22:22:33
LastEditors: water.li
LastEditTime: 2022-06-30 22:30:49
FilePath: \note\LeetCode\450.删除二叉搜索树中的节点.py
'''
#
# @lc app=leetcode.cn id=450 lang=python3
#
# [450] 删除二叉搜索树中的节点
#

# @lc code=start
# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, val=0, left=None, right=None):
#         self.val = val
#         self.left = left
#         self.right = right
class Solution:
  def deleteNode(self, root: Optional[TreeNode], key: int) -> Optional[TreeNode]:
    if root is None:
      return root
    if root.val > key:
      root.left = self.deleteNode(root.left, key)
    elif root.val < key:
      root.right = self.deleteNode(root.right, key)
    elif root.left is None or root.right is None:
      root = root.left if root.left else root.right
    else:
      successor = root.right
      while successor.left:
        successor = successor.left
      successor.right = self.deleteNode(root.right, successor.val)
      successor.left = root.left
      return successor
    return root
# @lc code=end

