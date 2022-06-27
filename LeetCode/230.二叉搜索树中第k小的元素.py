'''
Author: water.li
Date: 2022-06-27 22:25:40
LastEditors: water.li
LastEditTime: 2022-06-27 22:43:45
FilePath: \note\LeetCode\230.二叉搜索树中第k小的元素.py
'''
#
# @lc app=leetcode.cn id=230 lang=python3
#
# [230] 二叉搜索树中第K小的元素
#

# @lc code=start
# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, val=0, left=None, right=None):
#         self.val = val
#         self.left = left
#         self.right = right


class Solution:
  def kthSmallest(self, root: TreeNode, k: int) -> int:
    stack = []
    while root or stack:
      while root:
        stack.append(root)
        root = root.left
      root = stack.pop()
      k -= 1
      if k == 0:
        return root.val
      root = root.right
# @lc code=end