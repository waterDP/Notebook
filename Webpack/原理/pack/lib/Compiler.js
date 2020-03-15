const fs = require('fs')
const path = require('path')
const babylon = require('babylon')
const t = require("@babel/types")
const traverse = require('@babel/traverse').default
const generator = require('@babel/generator').default
const ejs = require('ejs')
const {SyncHook} = require('tapable')

// babylon 主要就是把源码转换成ast
// @babel/traverse
// @babel/types
// @babel/generator
class Compiler {
  constructor(config) {
    // entry output
    this.config = config
    // 需要保存入口文件的路径 
    this.entryId; // './src/index.js'
    // 需要保存所有的模块依赖
    this.modules = {}
    this.entry = config.entry  // 入口路径
    this.root = process.cwd() // 工作路径
    this.hooks = {
      entryOptions: new SyncHook(),
      compiler: new SyncHook(),
      afterCompiler: new SyncHook(),
      afterPlugins: new SyncHook(),
      run: new SyncHook(),
      emit: new SyncHook(),
      done: new SyncHook()
    }
    // 如果传递了plugins参数
    let plugins = this.config.plugins
    if (Array.isArray(plugins)) {
      plugins.forEach(plugin => {
        plugin.apply(this)
      })
    }
    this.hooks.afterPlugins.call()
  }
  getSource(modulePath) {
    let rules = this.config.module.rules
    // 拿到每个规则来处理
    for (let i =0; i < rules.length; i++) {
      let rule = rules[i]
      let {test, use} = rule
      let len = rule.length - 1
      if (test.test(modulePath)) { // 这个模块需要通过loader来转化
        function normalLoader() {
          let loader = require(use[len--])
          content = loader(content) 
          // 递归调用loader 实现转化功能
          if (len >= 0) {
            normalLoader();
          }
        }
        normalLoader();
      }
    }
    let content = fs.readFileSync(modulePath, 'utf8')
    return content
  }
  // 解析源码
  parse(source, parentPath) {  // AST解析语法树
    let ast = babylon.parse(source)
    let dependencies = [] // 依赖的数组
    traverse(ast, {
      CallExpression(p) {
        let node = p.node
        if (node.callee.name === 'require') {
          node.callee.name = '__webpack_require__'
          let moduleName = node.arguments[0].value // 模块的引用名字
          moduleName = moduleName + (path.extname(moduleName)? '' : '.js')
          moduleName = './' + path.join(parentPath, moduleName)
          dependencies.push(moduleName)
          node.arguments = [t.stringLiteral(moduleName)]
        }
      }
    })
    let sourceCode = generator(ast).code

    return {
      sourceCode, 
      dependencies
    }
  }
  // 构建模块
  buildModule(modulePath, isEntry) {
    // 拿到模块的内容
    let source = this.getSource(modulePath)
    // 模块的id modulePath = modulePath - this.rootPath
    let moduleName = './' + path.relative(this.root, modulePath)
    if (isEntry) {
      this.entryId = moduleName // 保存入口的名字
    }
    // 解析需要把source源码进行改造  返回一个依赖列表
    let {sourceCode, dependencies} = this.parse(source, path.dirname(moduleName))
    // 把相对路径和模块中的内容对应起来
    this.modules[moduleName] = sourceCode

    dependencies.forEach(dep => { // 附模块的加载 递归加载
      this.buildModule(path.join(this.root, dep), false)
    })
  }
  emitFile() { // 发射文件
    // 用数据 渲染我们的模块
    // 拿到输出到那个目录下
    let main = path.join(this.config.output.path, this.config.output.filename)
    // 模板的路径
    let templateStr = this.getSource(path.join(__dirname, 'main.ejs'))
    let code = ejs.render(templateStr, {entryId: this.entryId, modules: this.modules})
    this.assets = {}
    this.assets[main] = code;
    fs.writeFileSync(main, this.assets[main]) 
  }
  run() {
    this.hooks.run.call()
    // 执行 并且创建模块的依赖关系
    this.hooks.compiler.call()
    this.buildModule(path.resolve(this.root, this.entry), true)
    this.hooks.afterCompiler.call()
    // 发射一个文件  打包后的文件 
    this.emitFile()
    this.hooks.emit.call()
    this.hooks.done.call()
  }
}
module.exports = Compiler