const {getOptions, interpolateName} = require('loader-utils')
function loader(content) {
  let options = getOptions(this) || {}
  let filename = options.filename || '[name].[hash].[ext]'
  let outputFilename = interpolateName(this, filename, {content})
  this.emitFile(outputFilename, content)
  return `module.exports = ${JSON.stringify(outputFilename)}`
}

loader.raw = true
module.exports = loader