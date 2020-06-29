import History from './base'

function ensureSlash() {
	if (window.location.hash) { // ff 不兼容 window.location.href
		return
	}
	window.location.hash = '/'
}

class HashHistory extends History {
	constructor(router) {
		super(router)
		this.router = router

		ensureSlash() // 保证页面一加载就要有hash值
	}
	getCurrentLocation() {
		return window.location.hash.slice(1) // 除了# 后面的就是路径 
	}
	setUpListener() {
		window.addEventListener('hashChange', () => {
			this.transitionTo(this.getCurrentLocation())
		})
	}
}


export default HashHistory