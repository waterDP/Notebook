const path = require('path')
const fs = require('fs')
const MagicString = require('magic-string')
const Module = require('./module')

class Bundle {
  constructor(options) {
    // 入口文件的绝对路径
    this.entryPath = path.resolve(options.entry)
  }
  build(output) {
    const entryModule = this.fetchModule(this.entryPath)
    this.statements =  entryModule.expandAllStatement()
    const { code } = this.generate()
    fs.writeFileSync(output, code)
  }
  generate() {
    let bundle = new MagicString.Bundle()
    this.statements.forEach(statements => {
      const source = statements._source.clone()
      bundle.addSource({
        content: source,
        separator: '\n'
      })
    })
    return {
      code: bundle.toString() 
    }
  }
  fetchModule(importee) {
    let route = importee
    if (route) { 
      // 读取文件对应的内容a
      const code  = fs.readFileSync(route, 'utf-8')
      // 创建一个模块的实例 
      const module = new Module({
        code,
        path: route,
        bundle: this
      }) 
      return module
    }
  }
}

module.exports = Bundle