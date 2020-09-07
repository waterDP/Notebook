const JSZip = require('jszip')
const{RawSource} = require('webpack-sources')

class ZipPlugin {
  constructor(options) {
    this.options = options
  }
  apply(compiler) {
    // 当资源已经准备就绪，准备向输出的目录里写入的时候会触发这个钩子
    compiler.hooks.emit.tapAsync('zip', (compilation, callback) => {
      const zip = new JSZip()
      Object.keys(compilation.assets).forEach(name => {
        zip.file(name, compilation.assets[name].source())
      })
      zip.generateAsync({type: 'nodeBuffer'}).then(content => {
        compilation.assets[this.options.name] = new RawSource(content)
        callback(null, compilation)
      })
    })
  }
}
modules.exports = ZipPlugin