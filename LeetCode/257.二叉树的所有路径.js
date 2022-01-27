/*
 * @Author: water.li
 * @Date: 2022-01-27 21:22:46
 * @Description: 
 * @FilePath: \notebook\LeetCode\257.二叉树的所有路径.js
 */
/*
 * @lc app=leetcode.cn id=257 lang=javascript
 *
 * [257] 二叉树的所有路径
 *
 * https://leetcode-cn.com/problems/binary-tree-paths/description/
 *
 * algorithms
 * Easy (68.73%)
 * Likes:    641
 * Dislikes: 0
 * Total Accepted:    166K
 * Total Submissions: 241.1K
 * Testcase Example:  '[1,2,3,null,5]'
 *
 * 给你一个二叉树的根节点 root ，按 任意顺序 ，返回所有从根节点到叶子节点的路径。
 * 
 * 叶子节点 是指没有子节点的节点。
 * 
 * 
 * 示例 1：
 * 
 * 
 * 输入：root = [1,2,3,null,5]
 * 输出：["1->2->5","1->3"]
 * 
 * 
 * 示例 2：
 * 
 * 
 * 输入：root = [1]
 * 输出：["1"]
 * 
 * 
 * 
 * 
 * 提示：
 * 
 * 
 * 树中节点的数目在范围 [1, 100] 内
 * -100 <= Node.val <= 100
 * 
 * 
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
 * @return {string[]}
 */
var binaryTreePaths = function(root) {
  const ret = []
  const help = (node, path = '') => {
    if (node.left) {
      help(node.left, path+node.val+'->')
    }
    if (node.right) {
      help(node.right, path+node.val+'->')
    }
    if (!node.left && !node.right) {
      ret.push(path+node.val)
    }
  }
  help(root)
  return ret
};
// @lc code=end

