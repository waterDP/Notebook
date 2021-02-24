/*
 * @Description: 
 * @Date: 2021-01-28 15:11:29
 * @Author: water.li
 */
const http = require('http')
const fs = require('fs')
const path = require('path')
const url = require('url')

const server = http.createServer((req, res) => {
  let {pathname} = url.parse(req.url)
  if (['/get.html'].includes(pathname)) {
    res.statusCode = 200
    res.setHeader('Context-Type', 'text/html')
    let content = fs.readFileSync(path.join(__dirname, 'static', 'get.html'))
    res.end(content)
  } else if (pathname === '/get') {
    res.statusCode = 200
    res.setHeader('Content-type', 'text/plain')
    res.end('get')
  } else {
    res.statusCode = 404
    res.end()
  }
})

server.listen(8080)