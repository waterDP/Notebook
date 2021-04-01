/*
 * @lc app=leetcode.cn id=106 lang=javascript
 *
 * [106] 从中序与后序遍历序列构造二叉树
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
 * @param {number[]} inorder
 * @param {number[]} postorder
 * @return {TreeNode}
 */
var buildTree = function(inorder, postorder) {
  const helper = (inorder, postorder) => {
    const value = postorder.pop()
    const index = inorder.indexOf(value)
    return value == undefined 
      ? null : 
      new TreeNode(
        value, 
        helper(inorder.slice(0, index), postorder.slice(0, index)), 
        helper(inorder.slice(index + 1), postorder.slice(index)))
  }

  return helper(inorder, postorder)
};
// @lc code=end

