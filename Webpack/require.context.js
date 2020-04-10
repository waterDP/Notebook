/**
 * @param directory 要搜索的文件夹目录，不能是变量，否则在编译阶段无法定位目录
 * @param useSubdirectories 是否搜索子目录
 * @param regExp 匹配文件的正则表达式
 * @return {Object} 返回一个具有resolve, keys, id 三个属性的方法
 * ! resolve() 它返回的是被解析模块的id，接受一个参数request 
 * ! keys() 它返回一个数组，由所有符合上下文模块处理的请求组成
 * ! id 是上下文模块里面所包含的模块id，它可能在你的使用module.hot.accept的时候被用到
 */  
require.context('demo', false, /\.js$/)

// todo vue公共组件引入
const files = require.context('.', true, /\.vue$/)
const install = Vue => {
  files.keys().forEach(url => {
    const componentConfig = files(url)
    const component = componentConfig.default || componentConfig
    Vue.component(component.name, component)
  })
}
export default install

// todo vuex 模块收集
const files = require.context('.', true, /^\.\.\/[^/]+(\/.+)\/index\.js$/)

const modules = files.keys().reduce((all, url) => {
  let module = files(url).default
  let fields = url.split('/')
  fields.shift()
  fields.pop()
  let temp = {}
  _.set(temp, fields.join('.modules.'), module)
  _.merge(all, temp)
  return all
}, {})

export default modules