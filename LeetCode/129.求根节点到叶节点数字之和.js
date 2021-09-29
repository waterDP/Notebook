/*
 * @lc app=leetcode.cn id=129 lang=javascript
 *
 * [129] 求根节点到叶节点数字之和
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
var sumNumbers = function(root) {
  let ret = 0
  const helper = (node, current) => {
    current = current*10 + node.val||0
    if (!node.left && !node.right) {
      ret += current
    }
    node.left && helper(node.left, current)
    node.right && helper(node.right, current)
  }
  helper(root, 0)
  return ret
};
// @lc code=end

