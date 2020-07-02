// 自动加载公共组件
const files = require('./', true, /\.vue$/)

const install = Vue => {
  files.keys().forEach(fileName => {
    const componentConfig = files(fileName)
    const component = componentConfig.default || componentConfig
    const componentName = component.name || fileName.replace(/^.\//, '').replace(/\.js$/, '')
    Vue.component(componentName, component)
  })
}
export default install