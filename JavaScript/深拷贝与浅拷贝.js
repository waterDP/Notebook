/*
 * @Author: water.li
 * @Date: 2020-03-29 11:44:32
 * @Description: 
 * @FilePath: \notebook\JavaScript\深拷贝与浅拷贝.js
 */
// 深拷贝 拷贝后的结果更改是不会影响拷贝前的 拷贝前后是没有关系的 
// 浅拷贝 改变拷贝前的内容， 会对拷贝后的内容有影响 拷贝前后是有关系的

/*
 * ===================================================
 *   浅拷贝 
 * ===================================================
 */

// todo for...in只循环第一层
function simpleCopy(obj) {
  let ret = Array.isArray(obj) ? [] : {}
  for (let i in obj) {
    ret[i] = obj[i]
  }
  return ret
}

// todo Object.assign方法
let obj = { a: 1, b: 2 }
let ret = Object.assign(obj)

// todo 直接用=赋值
let a = [1, 2, 3]
let ret = a

// todo 展开运算符
let obj = { name: 'jwr', address: { x: 100, y: 100 } }
let o = { ...obj }
obj.address.x = 200
console.log(obj, o)


/*
 * ====================================================
 *    深拷贝
 * ====================================================
 */

// todo JSON.parse(JSON.stringify()) 深拷贝
let obj = { name: 'jwr', address: { x: 100, y: 100 }, f: function () { }, un: undefined }
let o = JSON.parse(JSON.stringify(obj))
obj.address.x = 200

/** 
 * ! 缺点
 * 1. undefined,任意的函数、正则表达式以及Symbol值，在序列过程中会被忽略
 * 2. 它会抛弃对象的constructor。也就是深拷贝之后，不管这个对象原来的构造函数是什么，在深拷贝之后都会变成Object
 * 3. 如果对象中存在循环引用的情况，无法正确处理
 */

// todo 结构化克隆算法
/** 
 * Message Channel 建立两个端，一个端发送消息，另一个端接收消息
 * 这种方法的优点就是能解决循环引用的问题，还支持大量的内置数据类型。
 * 缺点就是这个方法是异步的
 */

function structoralClone(obj) {
  return new Promise(resolve => {
    const { port1, port2 } = new MessageChannel()
    port2.onmessage = ev => resolve(ev.data)
    port1.postMessage(obj)
  })
}

const obj = { a: 1, b: 2 }

structoralClone(obj).then(res => {
  res.a = 4
  console.log(obj)
  console.log(res)
})


// todo 实现一个拷贝 实现一个递归拷贝
function deepClone(obj, hash = new WeekMap()) {
  if (obj == null) return obj // 如果是null或者undefined，我就不进行拷贝操作
  if (obj instanceof Date) return new Date(obj)
  if (obj instanceof RegExp) return new RegExp(obj)
  // 可能是对象或者一个普通的值 如果是函数的话 是不是需要深拷贝的
  if (typeof obj !== 'object') return obj  // 普通的值直接返回
  if (hash.get(obj)) return hash.get(obj)
  // 是对象的话就进行拷贝
  let cloneObj = new obj.constructor
  hash.set(obj, cloneObj)
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      // 实现一个递归拷贝
      cloneObj[key] = deepClone(obj[key], hash)
    }
  }
  return cloneObj
}

let obj = null
deepClone(obj)

// todo 递归拷贝，解决循环引用的问题

/*
 * 深拷贝一个值
 * @param value 
 */
function cloneDeep(value) {
  // 记录被拷贝的值，避免循环引用的出现
  let memo = {} 

  /*
  * 判断是否是基本数据类型
  * @param value 
  */
  function isPrimitive(value) {
    return (typeof value === 'string' ||
      typeof value === 'number' ||
      typeof value === 'symbol' ||
      typeof value === 'boolean')
  }

  /*
  * 判断是否是一个js对象
  * @param value 
  */
  function isObject(value) {
    return Object.prototype.toString.call(value) === "[object Object]"
  }

  function baseClone(value) {
    let res

    if (isPrimitive(value)) {
      return value
    } else if (Array.isArray(value)) {
      res = [...value]
    } else if (isObject(value)) {
      res = { ...value }
    } else {
      res = value
    }

    res && Reflect.ownKeys(res).forEach(key => {
      if (typeof res[key] === "object" && res[key] !== null) {
        if (memo[res[key]]) {
          res[key] = memo[res[key]]
        } else {
          memo[res[key]] = res[key]
          res[key] = baseClone(res[key])
        }
      }
    })
    return res
  }

  return baseClone(value)
}


// ! 递归太深，会引起栈溢出的问题
// todo BFS 广度优先搜索
function cloneDeep(obj) {
  const q = [obj] // q是一个队列结构，实现BFS的基础
  const res = {}
  const map = new Map() // 缓存拷贝的值，避免循环引用的问题
  map.set(obj, res)

  const isObject = o => Object.prototype.toString.call(o) === '[object object]'

  while (q.length) {
    const t = q.shift()
    Object.keys(t).map(key => {
      const value = t[key]
      if (isObject(value)) {
        // 如果对象已经存在在表中，说明存在循环引用
        if (map.has(value)) {
          map.set(t, value)
        } else {
          // 建立这个属性对象与克隆节点的映射关系
          map.set(value, {})
          q.push(value)
        }
      }
      const clone = map.get(t)
      clone[key] = value
    })
  }

  return res
}