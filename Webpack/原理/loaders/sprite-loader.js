const postcss = require('post-css')
const path = require('path')
const loaderUtil = require('loader-utils')
const SpriteSmith = require('spritesmith')
const Tokenizer = require('css-selector-tokenizer')

function loader(inputSource) {
  let that = this
  let callback = this.async()
  function createPlugin(postcssOptions) {
    return function (css) { // 代表CSS文件本身
      css.walkDecls(function(decl) {
        let values = Tokenizer.parseValues(decl.value)
        values.nodes.forEach(value => {
          value.nodes.forEach(item => {
            if (item.type === 'url' && item.url.endWith('?sprite')) {
              // 拼接一个图片的绝对路径
              let url = path.resolve(that.context, item.url)
              item.url = postcssOptions.spriteFilename
              postcssOptions.rules.push({
                url,
                rule: decl.parent
              })
            }
          })
        })
        decl.value = Tokenizer.stringifyValues(values)
      })
      postcssOptions.rules.map(item => item.rule).forEach((rule, index) => {
        rule.append(
          postcss.decl({
            props: 'background-position',
            value: `_BACKGROUND_POSITION_${index}`
          })
        )
      })
    }
  }
  const postcssOptions = {spriteFilename: 'sprite.jpg', rules: []}
  let pipeline = postcss([createPlugin(postcssOptions)])
  pipeline.process(inputSource, {from: undefined}).then(cssResult => {
    let sprites = options.rules.map(item => item.url.slice(0, item.url.lastIndexOf('?')))
    SpriteSmith.run({src: sprites}, (err, spriteResult) => {
      let coordinates = spriteResult.coordinates
      Object.keys(coordinates).forEach((key, index) => {
        cssResult.css = cssResult.css.replace(
          `_BACKGROUND_POSITION_${index}`, 
          `-${coordinates[key].x}px -${coordinates[key].y}px`
          )
      }) 
      that.emitFile(postcssOptions.spriteFilename, cssResult.image)
      callback(null, `module.exports=${JSON.stringify(cssResult.css)}`)
    })
  })
}
loader.raw = true
module.exports = loader