/*
 * @lc app=leetcode.cn id=589 lang=javascript
 *
 * [589] N 叉树的前序遍历
 */

// @lc code=start
/**
 * // Definition for a Node.
 * function Node(val, children) {
 *    this.val = val;
 *    this.children = children;
 * };
 */

/**
 * @param {Node} root
 * @return {number[]}
 */
var preorder = function(root) {
  let res = []

  let stack = [root]

  while(stack.length) {
    let current = stack.pop()
    if (current) {
      res.push(current.val)
      const children = current.children
      if (children && children.length) {
        for (let i = children.length - 1; i>=0; i--) {
          stack.push(children[i])
        }
      }
    }
  }

  return res
};
// @lc code=end

