// 自动加载公共组件
const path = require('path')
const files = require.context('./', true, /\.vue$/)

const install = Vue => {
  files.keys().forEach(fileName => {
    const componentConfig = files(fileName)
    const component = componentConfig.default || componentConfig
    const componentName = component.name || path.baseName(fileName)
    Vue.component(componentName, component)
  })
}
export default install