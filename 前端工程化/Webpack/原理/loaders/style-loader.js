let loaderUtils = require('loader-utils')

function loader(source) {}

loader.pitch = function(remainingRequest, previousRequest, data) {
  let style = `
    var style = document.createElement('style')
    style.innerHTML = require(
      ${loaderUtils.stringifyRequest(this, `!!` + remainingRequest)}
    )
    document.head.appendChild(style)
  `
  return  style
}

module.exports = loader