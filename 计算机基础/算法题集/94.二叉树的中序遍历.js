/*
 * @lc app=leetcode.cn id=94 lang=javascript
 *
 * [94] 二叉树的中序遍历
 */

// @lc code=start
/**
 * Definition for a binary tree node.
 * function TreeNode(val, left, right) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.left = (left===undefined ? null : left)
 *     this.right = (right===undefined ? null : right)
 * }
 */
/**
 * todo morris 算法
 * @param {TreeNode} root
 * @return {number[]}
 */
var inorderTraversal = function (root) {
  const res = []
  let predecessor = null

  while (root) {
    if (root.left) {
      predecessor = root.left
      while (predecessor.right && predecessor.right !== root) {
        predecessor = predecessor.right
      }

      if (!predecessor.right) {
        predecessor.right = root
        root = root.left
      } else {
        res.push(root.val)
        predecessor.right = null
        root = root.right
      }
    }
    else {
      res.push(root.val)
      root = root.right
    }
  }
  return res
}
// @lc code=end

