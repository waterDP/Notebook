export function createRoute(record, location) {
    // 根据路径 算出匹配到了几个记录
    let res = []; // 如果匹配到了路径 需要将这个路径都放进来
    if (record) {
        while (record) { // /about/a  /about /about/a
            res.unshift(record);
            record = record.parent
        }
    }
    return {
        ...location,
        matched: res // 匹配 一个路径可能匹配到多条 
    }
}

function runQueue(queue, iterator, complete) {
    function next(index) {
        if (index === queue.length) return complete() // 调用路由更新逻辑
        let hook = queue[index]
        iterator(hook, () => next(index + 1))
    }
    next(0) // 一步一步走
}
class History {
    constructor(router) {
        this.router = router
        // 当前的路径 和 对应的匹配的结果
        this.current = createRoute(null, { // {matched:[],path:'/'}
            path: '/' // 默认路由就是/
        })
    }
    transitionTo(location, complete) { // 最好屏蔽一下 如果多次调用 路径相同不需要跳转
        // 需要根据路径 获取到对应的组件
        let record = this.router.match(location) // /about

        if (location == this.current.path && recode.matched.length === this.current.matched.length) {
            return // 为了保证不会多次触发页面更新
        }
    
        // 依次执行刚才定义的方法
        let queue = this.router.beforeHooks
        const iterator = (hook, next) => {
            // 调用用户的方法 传入next ，用户会手动调用next方法
            hook(record, this.current, next)
        }
        runQueue(queue, iterator, () => {
					this.updateRoute(record, complete) 
					this.cb && this.cb(record)
				})
    }
    updateRoute(record, complete) {
        this.current = record // 将当前路径进行更新
        complete && complete(record) // 告诉_route属性来更新，如果更新后 视图会重新渲染
    }
    setupListener() {
        window.addEventListener('hashchange', () => { // hash变化后页面会重新跳转
            this.transitionTo(window.location.hash.slice(1));
        })
    }
    listen(cb) {
        this.cb = cb;
    }
}

export default History