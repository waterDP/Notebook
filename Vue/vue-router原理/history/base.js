export function createRoute(record,location) {
    // 根据路径 算出匹配到了几个记录
    let res = []; // 如果匹配到了路径 需要将这个路径都放进来
    if(record){
       while (record) { // /about/a  /about /about/a
        res.unshift(record);
        record = record.parent
       }
    } 
    return {
        ...location,
        matched:res // 匹配 一个路径可能匹配到多条 
    }
}

function runQueue(queue,iterator,callback){
    function step(index){
        if(index === queue.length) return callback(); // 调用路由更新逻辑
        let hook = queue[index];
        iterator(hook,()=>step(index+1));
    }
    step(0); // 一步一步走
}
class History {
    constructor(router){
        this.router = router;
        // 当前的路径 和 对应的匹配的结果
        this.current = createRoute(null,{ // {matched:[],path:'/'}
            path:'/' // 默认路由就是/
        });
    }
    transitionTo(location,callback){ // 最好屏蔽一下 如果多次调用 路径相同不需要跳转
        // 需要根据路径 获取到对应的组件
        let r = this.router.match(location) ; // /about
        // *****
        if(location == this.current.path && r.matched.length ==this.current.matched.length ){
            return; /// 为了保证不会多次触发页面更新
        }
        // 在更改路径之前 需要先执行刚才的那些钩子
        callback && callback();
        // 依次执行刚才定义的方法
        let queue = this.router.beforeEachs; 
        const iterator = (hook,next) =>{
            // 调用用户的方法 传入next ，用户会手动调用next方法
            hook(this.current,r,next)
        }
        runQueue(queue,iterator,()=>{
            this.updateRoute(r,callback)
        })
    }
    updateRoute(r,callback){
        this.current = r; // 将当前路径进行更新
        this.cb && this.cb(r); // 告诉_route属性来更新，如果更新后 视图会重新渲染
      
    }
    setupListener(){
        window.addEventListener('hashchange',()=>{ // hash变化后页面会重新跳转
            this.transitionTo(window.location.hash.slice(1));
        })
    }
    listen(cb){
        this.cb = cb;
    }
}

export default History