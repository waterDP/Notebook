/**
 * @param directory 要搜索的文件夹目录，不能是变量，否则在编译阶段无法定位目录
 * @param useSubdirectories 是否搜索子目录
 * @param regExp 匹配文件的正则表达式
 * @return {Object} 返回一个具有resolve, keys, id 三个属性的方法
 * ! resolve() 它返回的是被解析模块的id，接受一个参数request 
 * ! keys() 它返回一个数组，由所有符合上下文模块处理的请求组成
 * ! id 是上下文模块里面所包含的模块id，它可能在你的使用module.hot.accept的时候被用到
 */  
require.context('path', false, /\.js$/)

// todo vue公共组件引入
const path = require('path')
const files = require.context('.', true, /\.vue$/)
const install = Vue => {
  files.keys().forEach(url => {
    const componentConfig = files(key)
    const component = componentConfig.default || componentConfig
    const componentName = component.name || path.basename(key, '.vue')
    Vue.component(componentName, component)
  })
}
export default install

// todo vuex 模块收集
const files = require.context('./modules/', true, /index.js/)

function collectModules(files, rootModules) {
  rootModules = _.cloneDeep(rootModules)
  files.keys().forEach(key => {
    const store = files(key).default
    const moduleName = key.replace(/^\.\//, '').replace(/\index.js$/, '')
    const modules = rootModules.modules || {}
    modules[moduleName] = store
    modules[moduleName].mutations = {...modules[moduleName].mutations, ...mutations}
    modules[moduleName].namespaced = true
    rootModules.modules = modules
  })
  rootModules.mutations = {...rootModules.mutations, ...mutations}
  return rootModules
}

export default new Vuex.Store(collectModules(files, rootModules))