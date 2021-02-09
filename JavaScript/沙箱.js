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
 *    方法的时候，允许配置runInNexContext为true或false的时候，判断是否传入一个新创建的sandbox对像以供vm使用
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



