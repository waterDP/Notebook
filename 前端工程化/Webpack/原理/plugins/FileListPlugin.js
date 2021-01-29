/*
 * @Description: 每次webpack打包后，自动产生一个打包文件清单，上面要记录文件名、文件数量等信息
 * @Date: 2021-01-29 16:09:40
 * @Author: water.li
 */
class FileListPlugin {
  constructor(options) {
    // 获取插件配置项
    this.filename = options && options.filename ? options.filename : 'FILELIST.md'
  }

  apply(compiler) {
    // 注册compiler上面的emit钩子
    compiler.hooks.emit.tapAsync('FileListPlugin', (compilation, cb) => {
      // 通过compilation.assets获取文件数量
      let len = Object.keys(compilation.assets).length
      // 添加统计信息
      let content = `#${len} file${len > 1 ? 's': ''} emitted by webpack\n\n`

      // 通过compilation.assets获取文件名
      for (let filename in compilation.assets) {
        content += `- ${filename}\n`
      }

      // 往compilation.assets中添加清单文件
      compilation.assets[this.filename] = {
        // 写入新的文件内容
        source: function() {
          return content
        },
        // 新文件大小（给webpack输出用的）
        size: function() {
          return content.length
        }
      }

      // 执行回调，让webpack继续执行
      cb()
    })
  }
}
module.exports = FileListPlugin