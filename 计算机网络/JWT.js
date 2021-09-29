// todo JWT (Json Web Token) 是目前最流行的跨域身份验证解决方案
// jwt 表示不需要在服务器端存储任何信息
// 每次你访问服务器的时候，服务器会通过私钥，生成一个token
// 浏览器再次访问服务器，带上这个token
/**
 * jwt的三个部分分别为
 * Header(头部) {alg: 'HS256', typ: 'JWT'}
 * Payload(负载)
 * Signature(签名)
 */

const Koa = require('koa')
const bodyparser = require('koa-bodyparser')
const path = require('path')
const views = require('koa-views')
const Router = require('@koa/router')
const crypto = require('crypto')
// const jwt = require('jwt-simple') // jsonwebtoken

let jwt = {
  base64URLEscape(content) {
    return content.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '')
  },
  base64URLUnEscape(str) {
    str += new Array(5 - str.length % 4).join('=')
    return str.replace(/\-/g, '+').replace(/_/g, '/')
  },
  toBase64(content) {
    let stringContent = content
    if (typeof content === 'object') {
      stringContent = JSON.stringify(stringContent)
    }
    const bufferContent = Buffer.from(stringContent).toString('base64')
    return this.base64URLEscape(bufferContent)
  },
  sign(content, secret) {
    let r = crypto.createHmac('sha256', secret).update(content).digest('base64')
    return this.base64URLEscape(r)
  },
  encode(payload, secret) {
    // 将head转化成 base64
    let header = this.toBase64({typ: 'JWT', alg: 'HS256'}) // 固定的head
    // 将payload转化成base64
    let content = this.toBase64(payload)
    // 用head和payload放在一起组成一个签名
    let sign = this.sign([header, content].join('.'), secret)
    return [header, payload, sign].join('.')
  },
  decode(token) {
    let [header, payload, sign] = token.split('.')
    let newSign = this.sign([header, payload].join('.'), secret)
    if (sing === newSign) {
      return Buffer.from(this.base64URLUnEscape(payload), 'base64').toString()
    } else {
      throw new Error('不对')
    }
  }
}

let app = new Koa()
let router = new Router()

app.use(bodyparser())
app.use(router.routes())

const secret = 'miya' // 密钥

router.post('/login', async (ctx, next) => {
  let {username, password} = ctx.request.body
  if (username === 'admin' && password === 'admin') {
    let token = jwt.encode(username, secret)
    ctx.body = {
      code: 200,
      username,
      token
    }
  }
})

router.get('/isLogin', async ctx => {
  // 默认用户会把token放到authorization这个属性上
  let token = ctx.get('authorization') 
  if (token) {
    try {
      let r = jwt.decode(token, secret)
      ctx.body = {
        code: 0,
        username: r
      }
    } catch {
      ctx.body = {
        code: 1,
        data: '没有登录'
      }
    }
  } else {
    ctx.body = {
      code: 1,
      data: '没有登录'
    }
  }
})

app.listen(3000)

// 前端
axios.interceptors.request.use(config => {
  config.headers.authorization = 'Bearer '// +token
  return config
})
