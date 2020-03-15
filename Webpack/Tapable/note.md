## SyncHook
## SyncBailHook
## SyncWaterfallHook 
```javascript
  function call(...args) {
    let [first, ...others] = this.tasks
    let ret = first(...args)
    others.reduce((result, fn) => {
      return fn(result)
    }, ret)
  }
```
## SyncLoopHook

## 异步的钩子分为了串行与并行 并行需要等待所有任务完成以后再调用回调方法
- 注册方法也分为了同步注册tap 与异步注册tapAsync
## AsyncParallelHook 异步并行
## AsyncParallelBaillHook 带保险的异步并行

## AsyncSeriesHook 异步串行的Hook
## AsyncSeriesWaterfullHook