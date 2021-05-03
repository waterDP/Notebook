/*
 * @lc app=leetcode.cn id=307 lang=javascript
 *
 * [307] 区域和检索 - 数组可修改
 *
 * https://leetcode-cn.com/problems/range-sum-query-mutable/description/
 *
 * algorithms
 * Medium (55.78%)
 * Likes:    257
 * Dislikes: 0
 * Total Accepted:    19.7K
 * Total Submissions: 35.4K
 * Testcase Example:  '["NumArray","sumRange","update","sumRange"]\n[[[1,3,5]],[0,2],[1,2],[0,2]]'
 *
 * 给你一个数组 nums ，请你完成两类查询，其中一类查询要求更新数组下标对应的值，另一类查询要求返回数组中某个范围内元素的总和。
 * 
 * 实现 NumArray 类：
 * 
 * 
 * 
 * 
 * NumArray(int[] nums) 用整数数组 nums 初始化对象
 * void update(int index, int val) 将 nums[index] 的值更新为 val
 * int sumRange(int left, int right) 返回子数组 nums[left, right] 的总和（即，nums[left] +
 * nums[left + 1], ..., nums[right]）
 * 
 * 
 * 
 * 
 * 示例：
 * 
 * 
 * 输入：
 * ["NumArray", "sumRange", "update", "sumRange"]
 * [[[1, 3, 5]], [0, 2], [1, 2], [0, 2]]
 * 输出：
 * [null, 9, null, 8]
 * 
 * 解释：
 * NumArray numArray = new NumArray([1, 3, 5]);
 * numArray.sumRange(0, 2); // 返回 9 ，sum([1,3,5]) = 9
 * numArray.update(1, 2);   // nums = [1,2,5]
 * numArray.sumRange(0, 2); // 返回 8 ，sum([1,2,5]) = 8
 * 
 * 
 * 
 * 
 * 提示：
 * 
 * 
 * 1 
 * -100 
 * 0 
 * -100 
 * 0 
 * 最多调用 3 * 10^4 次 update 和 sumRange 方法
 * 
 * 
 * 
 * 
 */

// @lc code=start
class TreeNode {
  constructor() {
    this.leftChild = null
    this.rightChild = null
    this.leftIndex = 0 
    this.rightIndex = 0
    this.sum = 0
  }
}

class SegmentTree {
  constructor(nums) {
    this.root = this.buildTree(nums, 0, nums.length-1)
  }
  buildTree(nums, start, end) {
    const root = new TreeNode()
    root.leftIndex = start
    root.rightIndex = end
    if (start === end) {
      root.sum =  nums[start]
      return root
    }
    const mid = Math.floor((start + end) / 2)
    root.leftChild = this.buildTree(nums, start, mid)
    root.rightChild = this.buildTree(nums, mid+1, end)
    root.sum = root.leftChild.sum + root.rightChild.sum
    return root
  }
}
/**
 * @param {number[]} nums
 */
var NumArray = function(nums) {
  if (!nums.length) return 
  this.tree = new SegmentTree(nums)
};


/** 
 * @param {number} i
 * @param {number} val
 * @return {void}
 */
NumArray.prototype.update = function(i, val) {
  this.updateHelper(this.tree.root, i, val)
};

NumArray.prototype.updateHelper = function(node, i, val) {
  const leftIndex = node.leftIndex
  const rightIndex = node.rightIndex
  if (leftIndex === rightIndex) {
    node.sum = val
    return
  }
  const mid = Math.floor((leftIndex + rightIndex) / 2)
  if (i <= mid) {
    this.updateHelper(node.leftChild, i, val)
  } else {
    this.updateHelper(node.rightChild, i , val)
  }
  node.sum = node.leftChild.sum + node.rightChild.sum
}

/** 
 * @param {number} left 
 * @param {number} right
 * @return {number}
 */
NumArray.prototype.sumRange = function(left, right) {
  return this.sumRangeHelper(this.tree.root, left, right)
};

NumArray.prototype.sumRangeHelper = function(node, i, j) {
  const leftIndex = node.leftIndex
  const rightIndex = node.rightIndex
  if (leftIndex === i && rightIndex === j) {
    return node.sum
  }
  const mid = Math.floor((leftIndex + rightIndex) / 2)
  let sum = 0
  if (j <= mid) {
    sum = this.sumRangeHelper(node.leftChild, i, j)
  } else if (i > mid) {
    sum = this.sumRangeHelper(node.rightChild, i, j)
  } else {
    sum =
      this.sumRangeHelper(node.leftChild, i, mid) +
      this.sumRangeHelper(node.rightChild, mid + 1, j)
  }
  return sum
}

/**
 * Your NumArray object will be instantiated and called as such:
 * var obj = new NumArray(nums)
 * obj.update(index,val)
 * var param_2 = obj.sumRange(left,right)
 */
// @lc code=end

