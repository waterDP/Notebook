/*
 * @lc app=leetcode.cn id=146 lang=javascript
 *
 * [146] LRU 缓存机制
 */

// @lc code=start
/**
 * @param {number} capacity
 */
var LRUCache = function(capacity) {
  this.max = capacity
  this.keys = []
  this.values = []
};

/** 
 * @param {number} key
 * @return {number}
 */
LRUCache.prototype.get = function(key) {
  let index = this.keys.indexOf(key)
  if (index > -1) {
    this.keys.splice(index, 1)
    
    // 取出value后删除，然后把value放前端去 
    let temp = this.values[index]
    this.values.splice(index, 1)
    this.keys.unshift(key)
    this.values.unshift(temp)
  }
  return index > -1 ? this.values[0] : -1
};

/** 
 * @param {number} key 
 * @param {number} value
 * @return {void}
 */
LRUCache.prototype.put = function(key, value) {
  let index = this.keys.indexOf(key)
  if (index > -1) {
    this.keys.splice(index, 1)
    this.values.splice(index, 1)
  }
  this.keys.unshift(key)
  this.values.unshift(value)
  if (this.keys.length > this.max) {
    this.keys.pop()
    this.values.pop()
  }
};

/**
 * Your LRUCache object will be instantiated and called as such:
 * var obj = new LRUCache(capacity)
 * var param_1 = obj.get(key)
 * obj.put(key,value)
 */
// @lc code=end

