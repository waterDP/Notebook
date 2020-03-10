const install = Vue => {
  // 默认我可以将这个router放到任务组件上使用
  Vue.mixin({
    beforeCreate() {
      // 判断是不是根
      if (this.$options.router) {
        // 保存根实例 
        this._routerRoot = this 
        this._router = this.$options.router
        // 路由的初始化
        this._router.init(this)  // 这里的this是根实例
      } else {
        // 子组件上都有一个——_routerRoot属性可以获致到最顶层的根实例
        this._routerRoot = this.$parent && this.$parent._routerRoot
      }
    },
  })
}

export default install