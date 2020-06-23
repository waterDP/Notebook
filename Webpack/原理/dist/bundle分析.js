(function(modules){
  /**
   * 1.把通过jsonp获取回来的新的模块定义 ./src/c.js 合并到modules对象上去，以方便下面的模块加载
   * 2.在installedChunks里面进行标识，标识此c代码块成功
   * 3.让promise变成成功态
   */
  function webpackJsonpCallback(data) {
    let chunkIds = data[0]  // 第一个元素是代码块的数组
    let moreModules = data[1] // 新的模块定义
    let resolves = []
    for (let i = 0; i < chunkIds.length; i++) {
      let chunkId = chunkIds[i]
      // 把promise的resolve方法都添加到resolves数组中去
      resolves.push(installedChunks[chunkId][0])
      installedChunks[chunkId] = 0
    }
    for (let moduleId in moreModules) {
      modules[moduleId] = moreModules[moduleId]
    }
    parentJsonpFunction(data)
    // 遍历resolves数组，挨个执行里面的resolve方法
    while (resolves.length) {
      resolve.shift()()
    }
  }

  const installedModules = {} // 模块缓存，存放已经加载过的模块
  const installedChunks = {
    main: 0
  }
  function __webpack_required__(moduleId) {
    // 判断一下这个模块是否缓存，如果有，说明这个模块已经加载过了，直接返回
    if (installedModules[moduleId]) {
      return installedModules[moduleId].exports
    }
    // 创建一个新的模块并赋值给module，并且放置到模块的缓存（installedModules）中
    const module = installedModules[moduleId] = {
      i: moduleId,
      l: false,
      exports: {}
    }
    // 执行模块中的方法
    modules[moduleId].call(module.exports, module, module.exports, __webpack_required__)
    module.l = true // 把此模块设置为已加载
    return module.exports
  }

  // todo 把模块的定义对象缓存在__webpack_require__.m属性上
  __webpack_required__.m = modules

  // todo 把已经加载过的模块缓存放在__webpack_require__.c属性上，方便以后获取
  __webpack_required__.c = installedModules

  // todo 给一个对象增加一个属性 d = defineProperty
  __webpack_required__.d = function(exports, name, getter) {
    // o = hasOwnProperty
    if (__webpack_required__.o(exports, name)) {
      Object.defineProperty(exports, name, {enumerable: true, get: getter})
    }
  }

  // todo 表示一个es模块 exports.__esModule=true 表示这是一个es6模块
  __webpack_required__.r = function(exports) {
    if (typeof Symbol !== 'undefined' && Symbol.toStringTag) {
      Object.defineProperty(exports, Symbol.toStringTag, {value: 'Module'})
    }
    Object.defineProperty(exports, '__esModule', {value: true})
  }
  
  // todo t核心作用是把一个任意的模块common.js es module都包装成esModule的形式
  __webpack_required__.t = function(value, mode) {
    // 如果与1为true，说明第一位是1，表示value是模块ID，需要直接通过require加载
    if (mode & 1) value = __webpack_required__(value) // 从模块ID变成了模块导出对象了
    // 说明可以直接返回
    if (mode & 8) return value
    if (mode & 4 && typeof value === 'object' && value.__esModule) {
      return value
    }
    const ns = Object.create(null)
    Object.defineProperty(ns, 'default', {enumerable: true, value})
    // &2等于true, 表示要把所有的value属性拷贝到命令空间上ns
    if (mode & 2 && typeof value !== 'string') {
      for (let key in value) {
        __webpack_required__.d(ns, key, function(key) {
          return value[key]
        }.bind(null, key))
      }
    }
    return ns // 此方法在赖加载时会用到
  }

  // todo Object.prototype.hasOwnProperty的代理
  __webpack_required__.o = function(object, property) {
    return Object.prototype.hasOwnProperty.call(object, property)
  }
  // todo publicPath
  __webpack_required__.p = ''

  // todo 获取默认导出，为了兼容各种模块
  __webpack_require__.n = function(module) {
    var getter = module && module.__esModule ?
      function getDefault() { 
        return module['default']
      } :
      function getModuleExports() { 
        return module 
      }
    __webpack_require__.d(getter, 'a', getter)
    return getter;
  }
  
  let jsonArray = window['webpackJsonp'] = window['webpackJsonp']||[]
  let oldJsonpFunction = jsonpArray.push.bind(jsonpArray) // 保存了push老方法
  // 重写了jsonArray.push方法，等于了webpackJsonpCallback
  jsonArray.push = webpackJsonpCallback
  jsonArray = jsonArray.slice() // 把数组做了一个浅克隆

  for (let i = 0; i < jsonpArray.length; i++) {
    webpackJsonCallback(jsonpArray[i])
  }

  function jsonpScript(chunkId) {
    return __webpack_required__.p + ''+({c: 'c'}[chunkId]||chunkId) + '.js'
  }

  let parentJsonpFunction = oldJsonFunction

  // todo 懒加载代码块chunkId
  __webpack_required__.e = function requireEnsure(chunkId) {
    let promises = []
    let installedChunkData = installedChunks[chunkId]
    if (installedChunkData !== 0) { // 说明还尚未加载过，需要加载
      if (installedChunkData) { // 如果installedChunkData不为0，但是有值说明正在加载中
        promises.push(installedChunkData[2]) // 直接把promise放进来 
      } else {
        let promise = new Promise(function (resolve, reject) {
          installedChunkData = installedChunks[chunkId] = [resolve, reject]
        })
        promises.push(promise)
        installedChunkData[2] = promise
        let script = document.createElement('script')
        script.src = jsonpScript(chunkId)
        document.head.appendChild(script)
      }
    }

    return Promise.all(promises) // 如果已经有数据的话，此Promise会立刻成功
  }

  return __webpack_required__(__webpack_required__.s = "./src/title.js")
})({
  "./src/index.js": 
    (function (modules, exports, __webpack_required__) {
      let title = __webpack_required__("./src/title.js")
      console.log(title) // 函数体
    }),
  "./src/title.js": 
    (function (modules, exports) {
      modules.exports = 'title'
    })
})