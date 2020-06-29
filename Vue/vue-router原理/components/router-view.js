export default {
	functional: true, // 函数式组件 没有状态 函数没有this 不需要new
	render(h, { parent, data }) { // data 是当前占位符的属性
		let route = parent.$route // 这个$route 被放到了vue的原型上
		let depth = 0 // 默认我肯定需要先渲染第一个
		// $vnode 表示的是“占位符”vnode  “渲染"vnode
		data.routerView = true
		while (parent) {
			if (parent.$vnode && parent.$vnode.data.routerView) {
				depth++
			}
			parent = parent.$parent
		}
		let record = route.matched[depth]   // [0,1]
		if (!record) {
			return h()
		}
		// 组件的参数 和 普通的不太一样  //{routerView:true}
		return h(record.component, data)
	}
}

// $vnode (placeHolderVnode)  _vnode(组件中包含的真实的那些div)
