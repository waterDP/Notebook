#
# @lc app=leetcode.cn id=114 lang=python3
#
# [114] 二叉树展开为链表
#
# https://leetcode.cn/problems/flatten-binary-tree-to-linked-list/description/
#
# algorithms
# Medium (73.01%)
# Likes:    1382
# Dislikes: 0
# Total Accepted:    329.7K
# Total Submissions: 451.5K
# Testcase Example:  '[1,2,5,3,4,null,6]'
#
# 给你二叉树的根结点 root ，请你将它展开为一个单链表：
#
#
# 展开后的单链表应该同样使用 TreeNode ，其中 right 子指针指向链表中下一个结点，而左子指针始终为 null 。
# 展开后的单链表应该与二叉树 先序遍历 顺序相同。
#
#
#
#
# 示例 1：
#
#
# 输入：root = [1,2,5,3,4,null,6]
# 输出：[1,null,2,null,3,null,4,null,5,null,6]
#
#
# 示例 2：
#
#
# 输入：root = []
# 输出：[]
#
#
# 示例 3：
#
#
# 输入：root = [0]
# 输出：[0]
#
#
#
#
# 提示：
#
#
# 树中结点数在范围 [0, 2000] 内
# -100
#
#
#
#
# 进阶：你可以使用原地算法（O(1) 额外空间）展开这棵树吗？
#
#

# @lc code=start
# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, val=0, left=None, right=None):
#         self.val = val
#         self.left = left
#         self.right = right
class Solution:
  def flatten(self, root: Optional[TreeNode]) -> None:
    curr = root
    while curr: 
      if curr.left:
        predecessor = nxt = curr.left
        while predecessor.right:
          predecessor = predecessor.right
        predecessor.right = curr.right
        curr.left = None
        curr.right = nxt
      curr = curr.right
    # @lc code=end
