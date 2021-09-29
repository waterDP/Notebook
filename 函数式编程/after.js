const fs = require('fs')

function after(times, cb) {
  let obj = {}
  return function (key, value) {
    obj[key] = value
    if (--times === 0) {
      cb(obj)
    }
  }
}

let out = after(2, (obj) => {
  console.log(obj)
})

fs.readFile('./name.txt', 'utf8', function(err, data) {
  out('name', data)
})
fs.readFile('./age.txt', 'utf8', function(err, data) {
  out('age', data)
})



function after(n, func) {
  if (typeof func != 'function') {
    throw new TypeError('Expected a function')
  }
  return function(...args) {
    if (--n < 1) {
      return func.apply(this, args)
    }
  }
}
 
// lodash after
export default after