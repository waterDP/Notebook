/*
 * @Author: water.li
 * @Date: 2022-10-06 15:06:20
 * @Description:
 * @FilePath: \note\前端工程化\Webpack\原理\src\Compiler.js
 */
const path = require('path')
const fs = require('fs')

const { SyncHook } = require('tapable')
const types = require('babel-types')
const parser = require('@babel/parser')
const traverse = require('@babel/traverse').default
const generator = require('@babel/generator').default

const toUnixPath = require('./utils')

class Compiler {
  constructor(options) {
    this.options = options
    this.hooks = {
      run: new SyncHook(),
      done: new SyncHook(),
      emit: new SyncHook()
    }
    this.context = options.context || process.cwd()
  }
  run() {
    this.hooks.run.call()
    //* 开始执行编译之前，要先确定本次打包的入口模块
    let entry = {}
    if (typeof this.options.entry === 'string') {
      entry.main = this.options.entry
    } else {
      entry = this.options.entry
    }

    //* webpack当中的loaderj是什么时候工作中
    for (let entryName in entry) {
      const entryPath = toUnixPath(path.join(this.context, entry[entryName]))
      // 开始编译代码
      this.buildModule(entryName, entryPath)
    }
  }
  buildModule(moduleName, modulePath) {
    // 读取被打包模块的源代码
    const originalScoureCode = fs.readdirSync(modulePath, 'utf-8')
    let targetSourceCode = originalScoureCode

    //* 调用用loader 
    let loaders = []
    let rules = this.options.module.rules
    for (let i = 0; i < rules.length; i++) {
      // loaders可能存在多个 但本次只需要执行满足条件的loaders
      if (rules[i].test.test(modulePath)) {
        loaders = [...loaders, ...rules.use]
      }
      // * 采用降序的模式来调用loader
      for (let i = loaders.length - 1; i >= 0; i--) {
        targetSourceCode = require(loaders[i])(targetSourceCode) // 被打包模块的源代码
      }
      // ! 实现模块的递归编译：单层编译 + 递归编译
      // 模块ID
      const moduleID = './' + path.posix.relative(toUnixPath(this.context), modulePath)

      // 定义一个容器保存module
      let module = { id: moduleID, name: moduleName, dependecies: [] }

      const ast = parser.parser(targetSourceCode, { sourceType: 'module' })

    }
  }
}

module.exports = Compiler