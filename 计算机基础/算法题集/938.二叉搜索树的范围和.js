/*
 * @lc app=leetcode.cn id=938 lang=javascript
 *
 * [938] 二叉搜索树的范围和
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
 * @param {number} low
 * @param {number} high
 * @return {number}
 */
var rangeSumBST = function(root, low, high) {
  let sum = 0
  const q = [root]
  while(q.length) {
    const node = q.shift()
    if (!node) {
      continue
    }
    if (node.val > high) {
      q.push(node.left)
    } else if (node.val < low) {
      q.push(node.right)
    } else {
      sum += node.val
      q.push(node.left)
      q.push(node.right)
    }
  }
  return sum
};
// @lc code=end

