class Stack {
  constructor() {
    this.items = []
  }
  // 进栈
  push(element) {
    this.items.push(element)
  }
  // 弹栈 、出栈
  pop() {
    return this.items.pop()
  }
  // 查看栈顶元素
  peek() {
    return this.items[this.items.length - 1]
  }
  // 检查栈是否为空
  isEmpty() {
    return !!this.items.length
  }
  // 栈长度 
  size() {
    return this.items.length
  }
  // 清空栈
  clear() {
    this.items = []
  }
}

// todo map版本
class Stack {
  constructor() {
    this.count = 0
    this.items = {}
  }
  // 入栈
  push(element) {
    this.items[this.count++] = element
  }
  // 弹栈 
  pop() {
    if (this.isEmpty()) {
      return 
    }
    this.count--
    const result = this.items[this.count]
    delete this.items[this.count]
    return result
  }
  // 栈长
  size() {
    return this.count
  }
  // 判空
  isEmpty() {
    return this.count === 0
  }
  // 取栈顶
  peek() {
    if (this.isEmpty()) {
      return 
    }
    return this.items[this.count - 1]
  }
  // 清空栈
  clear() {
    this.items = {}
    this.count = 0
  }
}

// todo 应用 从十进制到二进制 
function decimalToBinary(decNumber) {
  const remStack = new Stack()
  let number = decNumber
  let rem
  let binaryString = ''

  while(number > 0) {
    rem = number % 2
    remStack.push(rem)
    number = Math.floor(number / 2)
  }
  while (!remStack.isEmpty) {
    binaryString += remStack.pop().toString()
  }
  return binaryString
}

// todo 括号配对验证
function isValid(s) {
  const stack = new Stack
  const len = s.length
  const lefts = '{[('
  if (len % 2) return false
  for (let i = 0; i < len; i++) {
    const item = s[i]
    if (lefts.includes(item)) {
      stack.push(item)
    } else {
      const top = stack.pop()
      switch(item) {
        case ')': 
          if (top !== '(') return false
          break
        case ']':
          if (top !== '[') return false  
          break
        case '}':
          if (top !== '{') return false
          break
        default:
          return false
      }
    }
  }
  return stack.isEmpty()
}