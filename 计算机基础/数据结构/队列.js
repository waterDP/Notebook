class Queue {
  constructor() {
    this.count = 0
    this.lowestCount = 0 
    this.items = {}
  }
  // 向队列尾部添加一个元素
  enqueue(element) {
    this.items[this.count++] = element
  }
  // 移除队列的第一个元素
  dequeue() {
    if (this.isEmpty()) {
      return 
    }
    const result = this.items[this.lowestCount]
    delete this.items[this.lowestCount]
    this.lowestCount--
  }
  // 返回队列的第一个元素
  peek() {
    if (this.isEmpty()) {
      return 
    }
    return this.items[this.lowestCount]
  }
  // 队列判空
  isEmpty() {
    return this.count - this.lowestCount === 0
  }
  // 队列大小 
  size() {
    return this.count - this.lowestCount
  }
  // 清空队列
  clear() {
    this.items = {}
    this.count = 0
    this.lowestCount = 0
  }
  toString() {
    if (this.isEmpty()) {
      return ''
    }
    let objString = `${this.items[this.lowestCount]}`
    for (let i = this.lowestCount + 1; i < this.count; i++) {
      objString = `${objString}, ${this.items[i]}`
    }
    return objString
  }
}

// todo 双端队列
class Dequeue {
  constructor() {
    this.count = 0
    this.lowestCount = 0
    this.items = {}
  }
  // 在队列前端添加元素
  addFront(element) {

  }
  // 在队列后端添加元素
  addBack(element) {

  }
  // 在队列前端移除元素
  removeFront() {

  }
  // 在队列后端移除元素
  removeBack() {

  }
  // 取队列前端的第一个元素
  peekFront() {

  }
  // 取队列后端的第一个元素
  peekBack() {
    
  }
}
