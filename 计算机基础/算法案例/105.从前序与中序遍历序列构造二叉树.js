/*
 * @lc app=leetcode.cn id=105 lang=javascript
 *
 * [105] 从前序与中序遍历序列构造二叉树
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
 * @param {number[]} preorder
 * @param {number[]} inorder
 * @return {TreeNode}
 */
var buildTree = function(preorder, inorder) {
  const helper = (pStart, pEnd, iStart, iEnd) => {
    if (pStart > pEnd) return null
    let rootVal = preorder[pStart]
    let root = new TreeNode(rootVal)
    let mid = inorder.indexOf(rootVal)
    let leftNum = mid - iStart  // 左子树的节点数
    root.left = helper(pStart+1, pStart+leftNum, iStart, mid-1)
    root.right = helper(pStart+leftNum+1, pEnd, mid + 1, iEnd)
    return root
  }
  return helper(0, preorder.length - 1, 0, inorder.length - 1)
};
// @lc code=end
