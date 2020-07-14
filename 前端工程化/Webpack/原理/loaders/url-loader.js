const {getOptions, interpolateName} = require('loader-utils')
const fileLoader = require('./file-loader')
const mine = require('mime')
function loader(content) {
  let {filename='[name].[hash].[ext]', limit=1024*64} = getOptions(this) || {}
  if (content.length > limit) {
    const contentType = mime.getType(this.resourcePath) // 返回些图片的内容类型
    let base64 = `data:${contentType};base64,${content.toString('base64')}`
    return `module.exports=${JSON.stringify(base64)}`
  }
  return fileLoader.call(this, content)
}

loader.raw = true
module.exports = loader