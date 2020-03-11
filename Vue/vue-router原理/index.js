// 入口文件
// 这里应该导出一个类这个类上应该有有一个install方法
import createMatcher from './create-matcher';
import install from './install';
import HashHistory from './history/hash'
class VueRouter {
    constructor(options){ 
        // matcher 匹配器  处理树形结构 将他扁平化

        // 这里会返回两个方法 addRoute   match 匹配对应的结果
        this.matcher = createMatcher(options.routes || [])
        // console.log(options); // 1) 默认需要先进行数据的格式化

        // 内部需要使用hash history 这里要进行路由的初始化工作
        // vue的内部路由有三种 
        this.history = new HashHistory(this); // base 表示的是基类 我们所有实现的路由功能公共方法都放在基类上 保证不同的路由api 有相同的使用方法

        this.beforeEachs = []
    }
    match(location){ // 只要路径一切还就 调用匹配器进行匹配 将匹配的结果返给我
        return this.matcher.match(location)
    }
    push(location){
        this.history.transitionTo(location,()=>{
            window.location.hash = location
        });
    }
    init(app){ // 初始化方法
        // app 是最顶层的vue的实例
        // 需要获取到路由的路径 进行跳转 匹配到对应的组件进行渲染
        // 当第一次匹配完成后 需要监听路由的变化 之后完成后续的更新操作

        const history = this.history;
        const setupHashListener = ()=>{ // 跳转成功后的回调
            history.setupListener(); // 监听路由变化的方法   父
        }
        history.transitionTo( // 跳转的方法   父
            history.getCurrentLocation(), // 获取当前路径的方法  子
            setupHashListener
        )
        history.listen((route)=>{ // 订阅好，等会路径属性一变化就执行此方法
            app._route = route
        })
    }
    beforeEach(cb){
        this.beforeEachs.push(cb); // 页面切换之前 会先执行这些方法
    }
}

VueRouter.install = install


export default VueRouter