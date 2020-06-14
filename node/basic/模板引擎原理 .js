// new Function + width

const path = require('path')
const fs = require('fs')

renderFile(
  path.resolve(__dirname, 'myTemplate.html'), 
  {name: 'zf', age: 10, arr: [1, 2, 3]}, 
  function(err, data) {}
)

function renderFile(filePath, obj, cb) {
  fs.readFile(filePath, 'utf8', (err, html) => {
    if (err) {
      return cb(err, html)
    }
    html = html.replace(/\{\{([^}]+)\}\}/g, function() {
      let key = arguments[1].trim()
      return '${'+key+'}'
    })
    let head = `let str = ''\r\n with(obj)\r\n` // !with
    head += 'str+=`'
    html = html.replace(/\{\%([^%]+)\%\}/g, function () {
      return '`\r\n' + arguments[1]
    })
    let tail = '`}\r\n return str'
    let fn = new Function('obj', head+html+tail) // ! new Function
    
    cb(err, fn(obj))
  })
}