/*
 * @lc app=leetcode.cn id=872 lang=javascript
 *
 * [872] 叶子相似的树
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
 * @param {TreeNode} root1
 * @param {TreeNode} root2
 * @return {boolean}
 */
var leafSimilar = function(root1, root2) {
  let seq1 = [], seq2 = []
  const dfs = (node, seq) => {
    if (!node.left && !node.right) {
      seq.push(node.val)
    } else {
      if (node.left) {
        dfs(node.left, seq)
      }
      if (node.right) {
        dfs(node.right, seq)
      }
    }
  }
  dfs(root1, seq1)
  dfs(root2, seq2)
  return seq1.toString() === seq2.toString()
};
// @lc code=end

