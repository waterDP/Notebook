/*
 * @lc app=leetcode.cn id=460 lang=javascript
 *
 * [460] LFU 缓存
 */

/**
 * @description: 定义节点
 * @param {*} key
 * @param {*} val
 */ 
var Node = function(key, val) {
  this.key = key
  this.val = val
  this.freq = 1 // 当前节点的key被使用的频率
  this.pre = null // 前一个节点的指针
  this.post = null // 后一个节点的指针
}

/**
 * @description: 定义双向链表
 */
var DoublyLinkedList = function() {
  this.head = new Node()
  this.tail = new Node()
  this.head.post = this.tail
  this.tail.pre = this.head
}

/* 删除节点 */
DoublyLinkedList.prototype.removeNode = function(node) {
  node.pre.post = node.post
  node.post.pre = node.pre
}

/* 添加节点 */
DoublyLinkedList.prototype.addNode = function(node) {
  node.post = this.head.node
  this.head.post.pre = node
  this.head.post = node
  node.pre = this.head
}

// @lc code=start
/**
 * @param {number} capacity
 */
var LFUCache = function(capacity) {
  this.capacity = capacity // 总的容量
  this.size = 0  // 当前已使用的容量
  this.minFreq = 0 // 最小使用频率，为删除操作使用
  this.cacheMap = new Map() 
  this.freqMap = new Map()
};

/** 
 * @param {number} key
 * @return {number}
 */
LFUCache.prototype.get = function(key) {

};

/** 
 * @param {number} key 
 * @param {number} value
 * @return {void}
 */
LFUCache.prototype.put = function(key, value) {

};

/**
 * Your LFUCache object will be instantiated and called as such:
 * var obj = new LFUCache(capacity)
 * var param_1 = obj.get(key)
 * obj.put(key,value)
 */
// @lc code=end

