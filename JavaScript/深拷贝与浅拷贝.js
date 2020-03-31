// 深拷贝 拷贝后的结果更改是不会影响拷贝前的 拷贝前后是没有关系的 
// 浅拷贝 改变拷贝前的内容， 会对拷贝后的内容有影响 拷贝前后是有关系的

// 引用关系
// ...运算符只能拷贝一层
let obj = {name: 'jwr', address: {x: 100, y: 100}}
let o = {...obj}
obj.address.x = 200
console.log(obj, o)


// 深拷贝 （不完整 不能实现复杂的拷贝）
let obj = {name: 'jwr', address: {x: 100, y: 100}, f: function() {}, un: undefined}
let o = JSON.parse(JSON.stringify(obj))
obj.address.x = 200


// 实现一个拷贝 实现一个递归拷贝
function deepClone(obj, hash = new WeekMap()) {
  if (obj == null) return obj // 如果是null或者undefined，我就不进行拷贝操作
  if (obj instanceof Date) return new Date(obj)
  if (obj instanceof RegExp) return new  RegExp(obj)
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
