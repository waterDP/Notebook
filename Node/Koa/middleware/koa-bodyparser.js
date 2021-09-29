const bodyparser = () => {
  return async (ctx, next) => {
    // 中间件的特点 可以统一处理逻辑
    // 如果处理完毕后 需要继续向下执行
    await new Promise((resolve, reject) => {
      let arr = []
      ctx.req.on('data', chunk => arr.push(chunk))
      ctx.req.on('end', () => {
        ctx.request.body = Buffer.concat(arr).toString()
        resolve()
      })
    })
    await next()
  }
}

module.exports = bodyparser