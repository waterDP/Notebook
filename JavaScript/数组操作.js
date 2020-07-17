// todo 数组的遍历
/**
 * ! for of 循环
 */ 
const colors = ['blue', 'green', 'white']
for (const color of colors) {
  console.log(color)
}

/**
 * ! for 循环
 * for (let i; i < array.length; i++) 循环使用递增的索引变量遍历数组项
 * for 通常需要在每个循环递增index变量
 */
const colors = ['blue', 'green', 'white']
for (let index = 0; index < colors.length; index++) {
  console.log(color)
}

/**
 * ! array.forEach()方法 
 * array.forEach(callback) 方法通过在每个数组项上调用callback函数来遍历数组项
 */
const colors = ['blue', 'green', 'white']
colors.forEach((value, index) => {
  console.log(value, index)
})

// todo 数组的映射
/**
 * ! Array.map() 方法 
 * array.map(callback) 方法通过在每个数组项上使用callback调用结果来创建一个新数组
 * array.map() 创建一个新映射数组，而不改变原始数组
 */
const numbers = [0, 2, 4]
const newNumbers = numbers.map(number => number + 1)


/**
 * ! Array.from() 方法 
 * Array.from(array, callback) 方法通过在每个数组上使用callback调用结果来创建一个背后数组
 * ? Array.from() 创建一个新的映射数组，而不改变原始数组
 * ? Array.from() 更适合从类似数组的对象进行映射
 */
const numbers = [0, 2, 4]
const newNumbers = Array.from(numbers, number => number + 1)

// todo 数据的简化
/**
 * ! Array.reduce() 方法 
 * ? 如果没有使用initialValue来设置初始值，则默认使用数组的第一个元素作为初始值
 */
const numbers = [1, 3, 5]
const sum = numbers.reduce((sum, curr) => sum + curr)

// todo 数据的连接
/**
 * ! array.concat() 方法
 */
const arr1 = [1, 3, 5]
const arr2 = [5, 6, 7]
const everyone = arr1.concat(arr2)

/**
 * !展开运算符 
 */
const arr1 = [1, 3, 5]
const arr2 = [5, 6, 7]
const con = [...arr1, ...arr2]

// todo 获取数组的片段
/**
 * ! array.slice() 方法
 * array.slice([fromIndex [, toIndex]) 返回数组的一个片段，该片段从fromIndex开始，以toIndex结尾（不包括toIndex本身）。
 * fromIndex可选参数默认为0，toIndex可选参数，默认为array.length
 */
const names = ["小智", "前端小智", "老王", "小三"]

const heroes = names.slice(0, 2)
const villains = names.splice(2)

// heroes => ["小智", "前端小智"]
// villains => ["老王", "小三"]

// todo 数组的拷贝
/**
 * ! array.slice() 方法
 */
const clone = arr.slice()

// todo 数组查找
/**
 * ! array.includes() 方法
 */ 
const numbers = [1,2,3,4,5]

numbers.includes(2) // true
numbers.includes(99) // false

/**
 * ! array.find()方法
 */ 
const numbers = [1, 3, 4, 5, 6, 7]
const evenNumber = numbers.find(number => number % 2 === 0)

/**
 * ! array.indexOf() 方法
 */
const name = ['water', 'follower', 'geo']
const index = name.indexOf('water') // index = 0

// todo 查询数组
/**
 * ! array.every() 方法
 */
const evens = [0, 2, 4, 6]
const numbers = [0, 1, 2, 3]
const isEven = number => number % 2 === 0
evens.every(isEven)  // => true
numbers.every(isEven) // => false

/**
 * !array.some() 方法
 */
const numbers = [1, 5, 7, 10]
const odds = [1, 3, 3, 3]
const isEven = number => number % 2 === 0

numbers.some(isEven)
odds.some(isEven)

// todo 数组过滤
/**
 * !array.filter() 方法
 * 如下，将一个数组过滤为仅包含偶数
 * ? array.filter()创建一个新数组，而不是改变原始数组
 */
const numbers = [1, 4, 5, 7, 9, 8]
const isEven = number => number % 2 === 0
const evens = numbers.filter(isEvent)

// todo 数组的插入
/** 
 * ! array.push() 方法，将一个或多个项追加数组的末尾，并返回新的数组长度
 * ! array.unshift() 方法，将一个或多个项追加到数组的开头，返回新的数组长度
 * ! array.pop() 方法从数组中删除最后一个元素，然后返回该元素。
 * ! array.shift() 方法从数组中删除第一个元素，然后返回该元素
 */

// todo 填充数组
/**
 * ! array.fill() 方法
 * array.fill(value [,fromIndex, [, toIndex]]) 用从fromIndex到toIndex的值填充数组（不包括toIndex本身）
 * formIndex可选参数默认值为0，toIndex可选参数，默认为array.length 
 */
const numbers = [1,2,3,4]
numbers.fill(0)
// [0, 0, 0, 0]

const length = 3
const zeros = Array(length).fill(0)
// [0, 0, 0]


//==================== todo 数组扁平化==================================================

// todo 递归实现 
function flat (arr) {
  let result = []
  arr.forEach(value => {
    if (value instanceof Array) {
      result = result.concat(flat(value)) 
    } else {
      result.push(value)
    }
  })
  return result
}

// todo reduce实现
function flat(arr) {
  return arr.reduce((prev, curr) => {
    return prev.concat(Array.isArray(curr) ? flat(curr) : cur)
  }, [])
}

// todo flat 参数为层数（默认一层）
arr.flat(Infinity)

// todo 扩展运算符
function flat(arr) {
  while(arr.some(Array.isArray)){
    arr = [].concat(...arr)
  }
  return arr
}
