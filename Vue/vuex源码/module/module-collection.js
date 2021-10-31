
let forEach = (obj, callback) => {
  Object.keys(obj).forEach(key => {
    callback(obj[key], key)
  })
}

export default class ModuleCollection {
  constructor(options) {
    // 深度遍历  将所有的子模块都遍历
    this.register([], options)
  }
  register(path, rootModule) {
    let rawModule = {
      _raw: rootModule,
      _children: {},
      state: rootModule.state
    }
    rootModule.rawModule = rawModule;  // 双向记录
    if (!this.root) {
      this.root = rawModule
    } else {
      let parentModule = path.slice(0, -1).reduce((root, current) => {
        return root._children[current]
      }, this.root)
      parentModule._children[path[path.length - 1]] = rawModule
    }
    if (rootModule.modules) {
      forEach(rootModule.modules, (module, moduleName) => {
        this.registor(path.concat(moduleName), module)
      })
    }
  }
}