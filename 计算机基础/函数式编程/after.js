const fs = require('fs')

function after(times, fn) {
  let obj = {}
  return function (key, value) {
    obj[key] = value
    if (--times === 0) {
      fn(obj)
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