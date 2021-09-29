/*
 * @lc app=leetcode.cn id=641 lang=javascript
 *
 * [641] 设计循环双端队列
 */

// @lc code=start
/**
 * Initialize your data structure here. Set the size of the deque to be k.
 * @param {number} K
 */
var MyCircularDeque = function (k) {
  this.items = {}
  this.capacity = k
  this.count = 0
  this.lowestCount = 0
}

MyCircularDeque.prototype.insertFront = function (value) {
  if (this.isFull()) return false
  if (this.isEmpty()) {
    return this.insertLast(value)
  } else if (this.lowestCount > 0) {
    // 有元素已经被从双端队列的前端移除，lowestCount会大于等于 1。
    // 这种情况下，我们只需要将 lowestCount 属性减 1 并将新元素的值放在这个键的位置上即可
    this.lowestCount--
    this.items[this.lowestCount] = value
    return true
  } else {
    // lowestCount 为 0 的情况。
    // 在第一位添加一个 新元素，并将所有元素后移一位来空出第一个位置。
    // 在所有的元素都完成移动后，第一位将是空闲状态，这样就可以用需要添加的新元素来覆盖它了
    for (let i = this.count; i > 0; i--) {
      this.items[i] = this.items[i - 1]
    }
    this.count++
    this.items[0] = value
    return true
  }
}

MyCircularDeque.prototype.insertLast = function (value) {
  if (this.isFull()) return false
  this.items[this.count] = value
  this.count++
  return true
}

MyCircularDeque.prototype.deleteFront = function () {
  if (this.isEmpty()) return false
  delete this.items[this.lowestCount]
  this.lowestCount++
  return true
}

MyCircularDeque.prototype.deleteLast = function () {
  if (this.isEmpty()) return false
  delete this.items[this.count]
  this.count--
  return true
}

MyCircularDeque.prototype.getFront = function () {
  if (this.isEmpty()) return -1
  return this.items[this.lowestCount]
}

MyCircularDeque.prototype.getRear = function () {
  if (this.isEmpty()) return -1
  return this.items[this.count - 1]
}

MyCircularDeque.prototype.isEmpty = function () {
  return this.count - this.lowestCount === 0
}

MyCircularDeque.prototype.isFull = function () {
  return this.count - this.lowestCount >= this.capacity
}
