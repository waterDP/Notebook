# koa

## ctx 常用属性和方法

### ctx.request

  ctx.request.url 获取请求URL
  ctx.request.query 获取解析的查询字符串
  ctx.request.querystring 获致原始的查询字符串
  ctx.request.path 获取请求路径
  ctx.request.method 获取请求方法post, get, delete ...

post 请示的参数获取和GET请求不同。Koa没有封装获取POST请求的参数方法，因此需要解析Context中的原生Node.js请求对象req

```js
  const Koa = require('koa')
  const app = new Koa()

  app.use(async ctc => {
    let postData = ''
    ctx.req.on('data', data => postData += data)
    ctx.req.on('end', () => {
      console.log(postData)
    })
  })
```

### ctx.response

  ctx.response.status = 200 设置响应状态码为200
  ctx.request.accept('json') 判断客户端希望的数据类型
  ctx.response.type = 'json' 设置响应的数据类型
  ctx.response.body = {data: 'Hello World'}  设置响应内容
  ctx.response.redirect()  重定向

### ctx.state

  ctx.state是推荐的命名空间，用于通过中间件传递信息和前端视图。类似koa-views这些渲染View层的中间件也会默认把ctx.state里面的属性作为View的上下文 

### ctx.cookies

  ctx.cookies.get(name, [options])
  ctx.cookies.set(name, value, [options])

### ctx.throw

## 常用的koa中间件

  koa-bodyparser 

  ```js
    let {name, password} = ctx.request.body
  ```

  koa-router

  ```js
    const Router = require('koa-router')
    const router = new Router()

    router.get('/', (ctx, next) => {})
    router.post('/', (ctx, next) => {})

    app.use(bodyParser())
      .use(router.routes())
      .use(router.allowMethods()) // 对异常状态码的处理

    app.listen(3000)
  ```

  koa-views / koa-static模块引擎
