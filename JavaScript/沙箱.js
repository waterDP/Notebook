/*
 * @Description: 
 * @Date: 2021-02-08 17:41:21
 * @Author: water.li
 */
/**
 * ! 沙箱的使用场景
 * 1. jsonp解析服务器所返回的jsonp请求时，如果不信任jsonp中的数据，可以通过创建沙箱方式来解析数据
 * 2. 执行第三方Js，当你有必要执行第三方 js的时候，而这份js又不一定可信的时候
 * 3. 在线代码编辑器，创建一个沙箱，防止对页面本身造成影响
 * 4. vue的服务端渲染 vue的服务端渲染实现中，通过创建沙箱执行前端的bundle文件；在调用createBundleRender
 *    方法的时候，允许配置runInNewContext为true或false的时候，判断是否传入一个新创建的sandbox对像以供vm使用
 * 5. vue模块中的表达式计算 vue模板中表达式的计算放在沙箱中，只能访问全局变量的一个白名单，如Math和Date
 *    你不能够在模板表达式中试图访问用户定义的全局变量
 */
//  todo 沙箱的实现
// ! new Function + with
function compileCode(src) {
  src = `with(exposeObj){${src}}`
  return new Function('exposeObj', src)
}
// 接下来，显露可以被访问的变量exposeObj，以及阻断沙箱内的对外访问。通过es6的proxy特性，可以获取到对象上的所有改写
function proxyObj(originObj) {
  let exposeObj = new Proxy(originObj, {
    has(target, key) {
      if (['console', 'Math', 'Date'].includes(key)) {
        return target[key]
      }
      if (!target.hasOwnProperty(key)) {
        return new Error(`Illegal operation for key ${key}`)
      }
      return target[key]
    }
  })
  return exposeObj
}

function createSandbox(src, obj) {
  let proxy = proxyObj(obj)
  compileCode(src).call(proxy, proxy)  // 绑定this，防止this访问window
}


// ! 借助iframe实现沙箱
<iframe sandbox src=""></iframe>
/* 
  这种沙箱会带来一些限制
  1.script脚本不能执行
  2.不能发送ajax 请求
  3.不能使用本地存储，即localStorage,cookie等、
  4.不能创建新的弹窗和window
  5.不能发送表单
  6.不能加载额外插件，比如flash
 */

/**
 * @description 配置
 * @param [allow-forms] 允许进行表单提交
 * @param [allow-scripts] 运行执行脚本
 * @param [allow-same-origin] 允许同域请求比如ajax storage
 * @param [allow-top-navigation] 允许iframe能够主导window.top进行页面跳转
 * @param [allow-popups] 允许iframe中弹出新窗口
 * @param [allow-pointer-lock] 在iframe中可以锁定鼠标，主要和鼠标锁定有关
 */


// ! node中的沙箱
// node 使用沙箱很简单，只需要利用原生的vm模块，便可以快速创建沙箱，同时指定上下文
const vm = require('vm')
const x = 1
const sandbox = {x: 2}
vm.createContext(sandbox)

const code = `x += 40; var y =17`
vm.runInContext(code, sandbox)

console.log(sandbox.x) // 42
console.log(sandbox.y) // 17

// vm 中提供了runNewContext, runInThisContent, runInContext三个方法
// 为了避免通过原型链逃逸，我们需要切断原型链
let ctx = Object.create(null) 
ctx.a = 1  // ctx不能包含引用类型的属性
vm.runInNewContext('this.constructor.constructor("return process")().exit()', ctx)



// todo 快照沙箱
function iter(obj, cb) {
  for (const prop in obj) {
    if (obj.hasOwnProperty(prop)) {
      cb(prop)
    }
  }
}
/**
 *  基于diff方式实现的沙箱，用于不支持Proxy的低版本浏览器
 */
class SnapshotSandbox {
  constructor(name) {
    this.name = name
    this.proxy = window
    this.type = 'Snapshot'
    this.sandboxRunning = true
    this.windowSnapshot = {}
    this.modifyPropsMap = {}
    this.active()
  }
  // 激活
  active() {
    // 记录当前快照
    this.windowSnapshot = {}
    iter(window, prop => {
      this.windowSnapshot[prop] = window[prop]
    })

    // 恢复之前的变更
    Object.keys(this.modifyPropsMap).forEach(p => {
      window[p] = this.modifyPropMap[p]
    })

    this.sandboxRunning = true
  }
  // 还原
  inactive() {
    this.modifyPropsMap = {}
    iter(window, prop => {
      if (window[prop] !== this.windowSnapshot[prop]) {
        // 记录变更，恢复环境
        this.modifyPropsMap[prop] = window[prop]
        window[prop] = this.windowSnapshot[prop]
      }
      this.sandboxRunning = false
    })
  }
}
const sandbox = new SnapshotSandbox()

// test
((window) => {
  window.name = '张三'
  window.age = 18
  console.log(window.name, window.age) // 张三， 18
  sandbox.inactive()  // 还原
  console.log(window.name, window.age) // undefined, undefined
  sandbox.active()
  console.log(window.name, window.age) // 张三， 18 
})(sandbox.proxy)

// todo legacy Sandbox
const callableFnCacheMap = new WeakMap()

function isCallable(fn) {
  if (callableFnCacheMap.has(fn)) {
    return true
  }
  const naughtySafari = typeof document.all == 'function' && typeof document.add === 'undefined'
  const callable = naughtySafari 
    ? typeof fn == 'function' && typeof fn !== 'undefined' 
    : typeof fn == 'function'

  if (callable) {
    callableFnCacheMap.set(fn, callable)
  }
  return callable
}

function setWindowProp(prop, value, toDelete) {
  if (value === undefined && toDelete) {
    delete window[prop]
  } else if (isPropConfigurable(window, prop) && typeof prop !== 'symbol') {
    Object.defineProperty(window, prop, {
      writable: true,
      configurable: true
    })
    window[prop] = value
  }
}

function getTargetValue(target, value) {
  if (isCallable(value) && !isBoundedFunction(value) && !isConstructable(value)) {
    const boundValue = Function.prototype.bind.call(value, target)
    for (let key in value) {
      boundValue[key] = value[key]
    }
    if (value.hasOwnProperty('prototype') && !boundValue.hasOwnProperty('prototype')) {
      Object.defineProperty(boundValue, 'prototype', {
        value: value.prototype,
        enumerable: false,
        writable: true
      })
    }

    return boundValue
  }
}

// 基于Proxy实现沙箱
class SingularProxySandbox {
  /** 沙箱期间新增的全局变量 **/
  addedPropsMapInSandbox = new Map()
  /** 沙箱期间更新的全局变量 **/
  modifiedPropsOriginalValueInSandbox = new Map()
  /** 持续记录更新的(新增和修改的)全局变量的map，用于在任意时刻做snapshot **/
  currentUpdatedPropsValueMap = new Map()

  name
  proxy
  type = 'LegacyProxy'
  sandboxRunning = true
  latestSetProp = null

  active() {
    if (!this.sandboxRunning) {
      this.currentUpdatedPropsValueMap.forEach((v, p) => setWindowProp(p, v));
    }

    this.sandboxRunning = true;
  }

  inactive() {
    // console.log(' this.modifiedPropsOriginalValueMapInSandbox', this.modifiedPropsOriginalValueMapInSandbox)
    // console.log(' this.addedPropsMapInSandbox', this.addedPropsMapInSandbox)
    //删除添加的属性，修改已有的属性
    this.modifiedPropsOriginalValueMapInSandbox.forEach((v, p) => setWindowProp(p, v));
    this.addedPropsMapInSandbox.forEach((_, p) => setWindowProp(p, undefined, true));

    this.sandboxRunning = false;
  }

  constructor(name) {
    this.name = name;
    const {
      addedPropsMapInSandbox,
      modifiedPropsOriginalValueMapInSandbox,
      currentUpdatedPropsValueMap
    } = this

    const rawWindow = window;
    //Object.create(null)的方式，传入一个不含有原型链的对象
    const fakeWindow = Object.create(null)

    const proxy = new Proxy(fakeWindow, {
      set: (_, p, value) => {
        if (this.sandboxRunning) {
          if (!rawWindow.hasOwnProperty(p)) {
            addedPropsMapInSandbox.set(p, value)
          } else if (!modifiedPropsOriginalValueMapInSandbox.has(p)) {
            // 如果当前 window 对象存在该属性，且 record map 中未记录过，则记录该属性初始值
            const originalValue = rawWindow[p]
            modifiedPropsOriginalValueMapInSandbox.set(p, originalValue)
          }

          currentUpdatedPropsValueMap.set(p, value)
          // 必须重新设置 window 对象保证下次 get 时能拿到已更新的数据
          rawWindow[p] = value

          this.latestSetProp = p

          return true
        }

        // 在 strict-mode 下，Proxy 的 handler.set 返回 false 会抛出 TypeError，在沙箱卸载的情况下应该忽略错误
        return true
      },

      get(_, p) {
        //避免使用 window.window 或者 window.self 逃离沙箱环境，触发到真实环境
        if (p === 'top' || p === 'parent' || p === 'window' || p === 'self') {
          return proxy
        }
        const value = rawWindow[p]
        return getTargetValue(rawWindow, value)
      },

      has(_, p) { //返回boolean
        return p in rawWindow
      },

      getOwnPropertyDescriptor(_, p) {
        const descriptor = Object.getOwnPropertyDescriptor(rawWindow, p);
        // 如果属性不作为目标对象的自身属性存在，则不能将其设置为不可配置
        if (descriptor && !descriptor.configurable) {
          descriptor.configurable = true;
        }
        return descriptor
      }
    })

    this.proxy = proxy
  }
}

let sandbox = new SingularProxySandbox()