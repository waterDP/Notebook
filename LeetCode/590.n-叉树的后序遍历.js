/*
 * @lc app=leetcode.cn id=590 lang=javascript
 *
 * [590] N 叉树的后序遍历
 */

// @lc code=start
/**
 * // Definition for a Node.
 * function Node(val,children) {
 *    this.val = val;
 *    this.children = children;
 * };
 */

/**
 * @param {Node} root
 * @return {number[]}
 */
var postorder = function (root) {
  let res = []
  let stack = [root]

  while (stack.length) {
    let current = stack.pop()
    if (current) {
      res.unshift(current.val)
      const children = current.children
      if (children && children.length) {
        for (let i = 0; i < children.length; i++) {
          stack.push(children[i])
        }
      }
    }
  }

  return res
};
// @lc code=end

