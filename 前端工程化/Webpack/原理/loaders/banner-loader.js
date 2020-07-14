const loaderUtils = require('loader-utils')
const validateOptions = require('schema-utils')
const fs = require('fs')

function loader(source, sourceMap, ast) {
  this.cacheable()  // 缓存
  let options = loaderUtils.getOptions(this)
  let cb = this.async()
  let schema = {
    type: 'object',
    properties: {
      filename: {
        type: 'string'
      },
      text: {
        type: 'string '
      }
    }
  }
  validateOptions(schema, options)
  if (options.filename) {
    this.addDependency(options.filename) // 添加文件依赖
    fs.readFile(options.filename, 'utf8', (err, data) => {
      cb(err, `/**${data}**/${source}`, sourceMap, ast)
    })
  } else {
    cb(null, `/**${options.text}**/${source}`, sourceMap, ast)
  }
}

module.exports = loader