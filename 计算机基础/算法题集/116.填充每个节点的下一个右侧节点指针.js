/*
 * @lc app=leetcode.cn id=116 lang=javascript
 *
 * [116] 填充每个节点的下一个右侧节点指针
 */

// @lc code=start
/**
 * // Definition for a Node.
 * function Node(val, left, right, next) {
 *    this.val = val === undefined ? null : val;
 *    this.left = left === undefined ? null : left;
 *    this.right = right === undefined ? null : right;
 *    this.next = next === undefined ? null : next;
 * };
 */

/**
 * @param {Node} root
 * @return {Node}
 */
var connect = function(root) {
  if (root === null) return root
	let pre = root
	while (pre.left !== null) {
		let temp = pre
		while (temp !== null) {
			temp.left.next = temp.right
			if (temp.next !== null) {
				temp.right.next = temp.next.left
			}
			// 向右遍历
			temp = temp.next
		}
		// 向下遍历
		pre = pre.left
	}
	return root
};
// @lc code=end

