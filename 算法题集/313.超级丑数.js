/*
 * @lc app=leetcode.cn id=313 lang=javascript
 *
 * [313] 超级丑数
 */

// @lc code=start
/**
 * @param {number} n
 * @param {number[]} primes
 * @return {number}
 */
var nthSuperUglyNumber = function(n, primes) {
  const len = primes.length
  const minHeap = new Heap
  let map = new Map
  minHeap.push(1)
  let count = 0
  let res = 1
  
  for (let price of primes) {
    minHeap.push(price)
    map.set(price, 1)
  }

  while(count < n) {
    res = minHeap.pop()
    for (let price of primes) {
      const temp = price * res
      if (!map.has(temp)) {
        minHeap.push(temp)
        map.set(temp, 1)
      }
    }
    count++
  }

  return res
};

// 构建小顶堆
const Heap = function() {
  this.data = []
}

Heap.prototype.push = function(val) {
  const len = this.data.length
  this.data[len] = val
  this.up(len)
}

Heap.prototype.pop = function() {
  // 交换堆项和最后一个值
  this.swap(0, this.data.length -1)
  // 删除堆顶的值
  const res = this.data.pop()
  this.down(0)
  return res
}

Heap.prototype.swap = function(a, b) {
  [this.data[a], this.data[b]] = [this.data[b], this.data[a]]
}

Heap.prototype.down = function(index) {
  if (index >= this.data.length) return 
  const left = index *2 +1
  const right = index*2 +2
  let target = index
  if (left < this.data.length && this.data[left] < this.data[target]) {
    target = left
  }
  if (right < this.data.length && this.data[right] < this.data[target]) {
    target = right
  }
  if (target !== index) {
    this.swap(target, index)
    this.down(target)
  }
}

Heap.prototype.up = function(index) {
  if (index === 0) return
  const father = Math.floor((index - 1) / 2)
  if (this.data[index] < this.data[father]) {
    this.swap(index, father)
    this.up(father)
  }
}
// @lc code=end

