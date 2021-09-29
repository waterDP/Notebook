/*
 * @lc app=leetcode.cn id=897 lang=javascript
 *
 * [897] 递增顺序搜索树
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
 * @return {TreeNode}
 */
var increasingBST = function(root) {
  const tem = []
  const trace = node => {
    node.left && trace(node.left)
    node && tem.push(node)
    node.right && trace(node.right)
  }
  trace(root)
  const ret = tem.shift()
  let curr = ret
  curr.left = null
  while (tem.length) {
    const r = tem.shift()
    r.left = null
    curr.right = r
    curr = curr.right
  }
  return ret
};
// @lc code=end

