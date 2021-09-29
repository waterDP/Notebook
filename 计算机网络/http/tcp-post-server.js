/*
 * @Description: 
 * @Date: 2021-01-28 16:23:57
 * @Author: water.li
 */
let net = require('net')
let Parser = require('./Parser')

const server = net.createServer(socket => {
  socket.on('data', data => {
    // 构建请求
    let request = data.toString()
    let parser = new Parser()
    let {method, url, headers, body} = parser.parse(request)
  
    // 构建响应
    let rows = []
    rows.push(`HTTP/1.1 200 OK`)
    // ...
    // 响应体
    let body = 'get' // todo mock
    rows.push(`\r\n${Buffer.byteLength(body).toString(16)}\r\n${body}\r\n0`)
    let response = rows.join('\r\n')
    socket.end(response)
  })
})

server.listen(8080)