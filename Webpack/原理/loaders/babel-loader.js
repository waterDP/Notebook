const babel = require('@babel/core')
const loaderUtils = require('loader-utils')
function loader(inputSource) { // this loader的上下文
  let options = loaderUtils.getOptions(this)
  let {code, map, ast} = babel.transform(inputSource, options)
  return this.callback(null, code, map, ast)
}

module.exports = loader