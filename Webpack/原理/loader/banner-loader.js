const loaderUtils = require('loader-utils')
const validateOptions = require('schema-utils')
const fs = require('fs')

function loader(source) {
  this.cacheable(false)  // 不要缓存
  let options = loaderUtils.getOptions(this)
  let cb = this.async()
  let schema = {
    type: 'object',
    properties: {
      type: 'string'
    },
    filename: {
      type: 'string'
    }
  }
  validateOptions(schema, options, 'banner-loader')
  if (options.filename) {
    this.addDependency(options.filename) // 添加文件依赖
    fs.readFile(options.filename, 'utf8', (err, data) => {
      cb(err, `/**${data}**/${source}`)
    })
  } else {
    cb(null, `/**${options.text}**/${source}`)
  }
}

module.exports = loader