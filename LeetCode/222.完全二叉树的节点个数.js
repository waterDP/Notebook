/*
 * @lc app=leetcode.cn id=222 lang=javascript
 *
 * [222] 完全二叉树的节点个数
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
var countNodes = function(root) {
  const countLevels = root => {
    let levels = 0
    while (root) {
      root = root.left
      levels++
    }
    return levels
  }
  const count = root => {
    if (!root) return 0
    let leftLevels = countLevels(root.left)
    let rightLevels = countLevels(root.right)

    if (leftLevels === rightLevels) {
      return count(root.right) + (1 << leftLevels) // Power(2, n)
    }
    return count(root.left) + (1 << rightLevels)
  }
  return count(root)
};
// @lc code=end

