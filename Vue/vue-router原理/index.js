// 入口文件
// 这里应该导出一个类， 这个类上应该有一个install方法
import install from "./install"
class VueRouter {
  constructor(options) {  // 默认先进行数据的格式化
    // matcher匹配器 处理树形结构   将它扁平化
    this.matcher = createMatcher(options.routes || [])
  }
  init(app) { // 初/始化方法 app 是最顶层的Vue实例

  }
}

VueRouter.intall = install;

export default VueRouter;