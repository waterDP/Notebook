// todo 基本类型的判断方式一
const toString = Object.prototype.toString
console.log(toString.call('foo')) // [object String]
console.log(toString.call(12)) // [object Number]
console.log(toString.call([1, 2])) // [object Array]
console.log(toString.call(true)) // [object Boolean]
console.log(toString.call(undefined)) // [object Undefined]
console.log(toString.call(null)) // [object Null]

console.log(toString.call({})) // [object Object]

let myExports = {}
Object.defineProperty(myExports, Symbol.toStringTag, {value: 'Module'})
console.log(toString.call(myExports)) // [object Module]