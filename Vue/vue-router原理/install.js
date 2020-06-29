import RouterView from './components/router-view'
import RouterLink from './components/router-link'
const install = (Vue) => {
	// 默认我希望可以将这个router放到任何的组件使用
	Vue.mixin({
		beforeCreate() {
			// 判断是不是根
			if (this.$options.router) { // ! 当前这个实例是根实例
				// 保存根实例
				this._routerRoot = this // 是给根实例增加_routerRoot
				this._router = this.$options.router

				// 路由的初始化
				this._router.init(this) // 这里的this是根实例

				// 将current属性定义成响应式的 这样稍后更新current 就可以刷新视图了
				// 这个对象上面挂的方法 不建议用户直接使用，这个东西是有可能被改变的
				// Vue.observable 2.6
				// 给当前根实例增加了一个_route属性 他取自当前的history中的current
				Vue.util.defineReactive(this, '_route', this._router.history.current)
				// 每次更新路径之后 需要更新_route属性 

			} else { // 子组件组件中的属性 是没有router属性的
				// 子组件上都有一个_routerRoot属性可以获取到最顶层的根实例
				this._routerRoot = this.$parent && this.$parent._routerRoot
				// 如果组件想获取到 根实例中传入的router
				// this._routerRoot._router 指代的都是当前router实例
			}
		}
	})
	// 实现了一个代理功能
	Object.defineProperty(Vue.prototype, '$route', { // 都是一些匹配到的属性 path  matched
		get() {
			return this._routerRoot._route
		}
	})
	Object.defineProperty(Vue.prototype, '$router', {
		get() {
			return this._routerRoot._router
		}
	})
	// 全局组件
	Vue.component('RouterView', RouterView)
	Vue.component('RouterLink', RouterLink)
}
export default install