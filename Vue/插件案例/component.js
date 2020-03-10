// 自动加载公共组件
const files = require('./', true, /\.vue$/)

const install = Vue => {
  files.keys().forEach(url => {
    const componentConfig = files(url)
    const component = componentConfig.default || componentConfig
    Vue.component(component.name, component)
  })
}
export default install