const babel = require('@babel/core')
const loaderUtils = require('loader-utils')
function loader(source) { // this loader的上下文
  let options = loaderUtils.getOptions(this)
  let cb = this.async()  // flag
  babel.transform(source, {
    ...options,  // presets
    sourceMap: true,
    filename: this.resourcePath.split('/').pop() // 文件名
  }, function (err, result) {
    cb(err, result.code, result.map)
  })
}

module.exports = loader;