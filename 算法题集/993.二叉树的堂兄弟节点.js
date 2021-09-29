/*
 * @lc app=leetcode.cn id=993 lang=javascript
 *
 * [993] 二叉树的堂兄弟节点
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
 * @param {number} x
 * @param {number} y
 * @return {boolean}
 */
var isCousins = function(root, x, y) {
  let arr = [root]
  while (arr.length) {
    let len = arr.length
    while (len--) {
      let node = arr.shift()  // 取出
      if (node.left && node.right && (node.left.val == x && node.right.val == y || node.left.val == y && node.right.val == x)) {
        return false   
      } 
      if (node.left) {
        arr.push(node.left)
      }
      if (node.right) {
        arr.push(node.right)
      }
    }
    if (arr.find(a => a.val == y) && arr. find(a => a.val === x)) {
      return true
    }
  }
  return false
};
// @lc code=end

