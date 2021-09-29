/*
 * @lc app=leetcode.cn id=98 lang=javascript
 *
 * [98] 验证二叉搜索树
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
 * @return {boolean}
 */
var isValidBST = function(root) {
  const helper = (root, lower, upper) => {
    if (root == null) {
      return true
    }
    if (root.val <= lower || root.val >= upper) {
      return false
    }
    return helper(root.left, lower, root.val) && helper(root.right, root.val, upper)
  }
  return helper(root, -Infinity, Infinity)
};
// @lc code=end
