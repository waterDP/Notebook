const http = require('http')
const querystring = require('querystring')

let server = http.createServer((req, res) => {
  let arr = []
  res.setCookie = (key, value, options) {
    let opts = []
    if (options.domain) {
      opts.push(`domain=${options.domain}`)
    }
    // ... 
    arr.push(`${key}=${value}; ${opts.join('; ')}`)
    res.setHeader('Set-Cookie', arr)
  }
  res.getCookie = (key) => {
    const qs = querystring(req.headers.cookie, '; ')
    return qs[key]
  }
  if (req.url === '/write') {
    // key value
    // domain 限制某个域可以访问
    // path  在哪个路径下可以访问cookie
    // expires(绝对时间)/max-age(相对时间)
    // httpOnly 是否服务端设置后，浏览器不能更改
    res.setHeader('Set-Cookie', ['name=zf; domain=Xxx', 'age=10'])
    res.setCookie('name', 'zf', {domain: '.zf.cn', path: '/', maxAge: 10})
    res.end('write ok')
  } else if (req.url === '/read') {
    res.end(res.getCookie('name') || 'empty')
  }
})

server.listen(3000)