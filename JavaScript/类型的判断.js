/*
 * @Author: water.li
 * @Date: 2020-05-05 16:43:52
 * @Description:  类型判断
 * @FilePath: \notebook\JavaScript\类型的判断.js
 */
// todo toString
const toString = Object.prototype.toString
console.log(toString.call('foo')) // [object String]
console.log(toString.call(12)) // [object Number]
console.log(toString.call([1, 2])) // [object Array]
console.log(toString.call(true)) // [object Boolean]
console.log(toString.call(undefined)) // [object Undefined]
console.log(toString.call(null)) // [object Null]
console.log(toString.call({})) // [object Object]
console.log(toString.call(() => {})) // [object Function]
console.log(toString.call(class A {})) // [object Function]
console.log(toString.call(/$abi^/))  // [object RegExp]

let myExports = {}
Object.defineProperty(myExports, Symbol.toStringTag, {value: 'Module'})
console.log(toString.call(myExports)) // [object Module]

// todo typeof 
console.log(typeof 1) // number
console.log(typeof 'string') // string
console.log(typeof false) // boolean
console.log(typeof undefined) // undefined
console.log(typeof null) // object
console.log(typeof function() {}) // function
console.log(typeof class A {}) // function
console.log(typeof []) // object
console.log(typeof {})  // object
console.log(typeof NaN)  // number

// todo instanceof a instanceof A 查找a的原型链上是否有A这个类