# axios

## 拦截器

请求拦截器是先添加的后执行

``` js
  // 请求拦截器
  axios.interceptors.request.use(config => {
    // ...
    return config // 请求拦截器必须返回config
  }, err => {})
  // 影响拦截器
  axios.interceptors.response.use(response => {}, err => {})
```

## 取消请求

```js
  const CancelToken = axios.CancelToken
  let cancel

  function getData() {
    if (typeof cancel === 'function') { // 竞态处理
      cancel() // 取消请求
    }
    axios.get('/user/123', {
      cancelToken: new CancelToken(c => cancel = c)
    }).then(() => {
      cancel = null
    }).catch(err => {
      if (axios.isCancel(err)) {
        console.log()
      } else {
        cancel = null
        console.log()
      }
    })
  }
```
