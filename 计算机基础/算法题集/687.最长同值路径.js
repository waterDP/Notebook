/*
 * @lc app=leetcode.cn id=687 lang=javascript
 *
 * [687] 最长同值路径
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
 * @param {TreeNode} root
 * @return {number}
 */
 const longestUnivaluePath = (root) => {
  let res = 0

  const helper = root => {
      if (root == null) {
          return 0
      }
      const left = helper(root.left)
      const right = helper(root.right)
      let leftPath = 0, rightPath = 0
      if (root.left && root.left.val == root.val) {
          leftPath = left + 1
      }
      if (root.right && root.right.val == root.val) {
          rightPath = right + 1
      }
      res = Math.max(res, leftPath + rightPath)
      return Math.max(rightPath, leftPath)
  }
  helper(root)
  return res
}

// @lc code=end