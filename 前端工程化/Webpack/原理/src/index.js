#! /usr/bin/env node
const path = require('path')
const fs = require('fs')

// ! 默认配置
const defaultConfig = {
  entry: './src/index.js',
  output: {
    filename: 'bundle.js'
  }
} 

const config = {
  ...defaultConfig, 
  ...require(
    path.resolve('./webpack.config.js')
  )
}

class Webpack {
  constructor(config) {
    this.config = config // 存储配置
    this.entry = config.entry
    this.root = process.cwd() // 工作目录 根目录
    // 存储所有代码
    this.modules = {}
  }
  parse(code, parent) {
    // 能够解析文件内容的require('xx.js')这种格式
    let r = /require\('(.*)'\)/g
    let deps = []
    // require('xx')替换为__webpack_require__
    code = code.replace(r, (match, arg) => {
      const retPath = path.join(parent, arg.replace(/'|"/g, ''))
      deps.push(retPath)
      return `__webpack_require__("./${retPath}")`
    })  

    return {
      code, 
      deps
    }
  }
  createModule(modulePath, name) {
    const fileContent = fs.readFileSync(modulePath, 'utf-8')  
    // 替换后的代码和依赖数组
    const {code, deps} = this.parse(fileContent, path.dirname(name))
    this.modules[name] = `
      function(module, export, __webpack_require__) {
        eval('${code}')
      }
    `
    // 循环获取所有依赖数组的内容
    deps.forEach(dep => {
      this.createModule(path.join(this.root, dep), './'+dep)
    })
  }
  generateModuleStr() {
    let fnTemp = ''
    Object.keys(this.modules).forEach(name => {
      fnTemp += `"${name}": ${this.modules[name]}`
    })
    return fnTemp
  }
  generateFile() {
    let template = fs.readFileSync(path.resolve(__dirname, './template.js'), 'utf-8')
    this.template = 
      template
      .replace('__entry', this.entry)
      .replace('__modules_content__', this.generateModuleStr())
    fs.writeFileSync('./dist/' + this.config.output.filename, this.template)
  }
  start() {
    const entryPath = path.resolve(this.root, this.entry)
    this.createModule(entryPath, this.entry)
    this.generateFile()
  }
}

const webpack = new Webpack(config)
webpack.start()

