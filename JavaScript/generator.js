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
let {value, done} = it.next()
value.then(data => {
  let {value, done} = it.next(data)
  value.then(data => {
    // it.throw('err')
    let {value, done} = it.next(data)
  })
})

// 优化 co.js的原理
co(read()).then(console.log).catch()

function co(it) {
  return new Promise((resolve, reject) => {
    function next(data) {
      let {value, done} = it.next(data  )
      if (!done) {
        Promise.resolve(value).then(next, reject)
      } else {
        resolve(value)
      }
    }
    next()
  })
}

