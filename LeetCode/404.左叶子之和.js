/*
 * @lc app=leetcode.cn id=404 lang=javascript
 *
 * [404] 左叶子之和
 */

// @lc code=start
/**
 * Definition for a binary tree node.
 * function TreeNode(val) {
 *     this.val = val;
 *     this.left = this.right = null;
 * }
 */
/**
 * @param {TreeNode} root
 * @return {number}
 */
var sumOfLeftLeaves = function(root) {
  let sum = 0
  const computeSum = (node) => {
    const left = node.left
    if(left && !left.left && !left.right) {
      sum += left.val
    }
    node.left && computeSum(node.left)
    node.right && computeSum(node.right)
  }
  root && computeSum(root)
  return sum
};
// @lc code=end

