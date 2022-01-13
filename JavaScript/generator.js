/*
 * @Author: water.li
 * @Date: 2020-06-13 12:09:15
 * @Description: 
 * @FilePath: \notebook\JavaScript\generator.js
 */
const fs = require('fs')
function * read() {
  try {
    let name = yield fs.readFile('name.txt', 'utf8')
    let age = yield fs.readFile(name, 'utf8')
    return age
  } catch (e) {
    // ...
  }
}

let it = read()
let {value1, done} = it.next()
value1.then(data => {
  let {value2, done} = it.next(data)
  value2.then(data => {
    // it.throw('err')
    let {value, done} = it.next(data)
  })
})

// 优化 co.js的原理
co(read()).then(console.log).catch()

function co(it) {
  return new Promise((resolve, reject) => {
    function next(data) {
      let {value, done} = it.next(data)
      if (!done) {
        Promise.resolve(value).then(next, reject)
      } else {
        resolve(value)
      }
    }
    next()
  })
}

function* fun(params) {
  console.log(params)  // 222
  let b = yield 11
  console.log(b)  // b {value: 11, done: false}
}

const g = fun(222)
let r1 = g.next()
let r2 = g.next(r1)
console.log(r2)