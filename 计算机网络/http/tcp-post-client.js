/*
 * @Description: 
 * @Date: 2021-01-28 15:33:26
 * @Author: water.li
 */
const net = require('net')

const ReadState = {
  UNSENT: 0,
  OPENED: 1,
  HEADERS_RECEIVED: 2,
  LOADING: 3,
  DONE: 4
}

class XMLHttpRequest {
  constructor() {
    this.readyState = ReadState.UNSENT // 默认是初始化的，未调用open方法
    this.headers = {'Connection': 'keep-alive'}
  }
  open(method, url) {
    this.method = method || 'GET'
    this.url = url
    let {hostname, port, path} = require('url').parse(url)
    this.hostname = hostname
    this.port = port
    this.path = path
    this.headers['Host'] = `${hostname}:${port}`
    // 通过传输层的net模块，发起请求
    const socket = this.socket = net.createConnection({
      hostname,
      port
    }, () => {
      socket.on('data', data => {
        data = data.toString()
        // 处理响应 
        let [response, bodyRows] = data.split('\r\n\r\n')
        let [statusLine, ...headerRows] = response.split('\r\n')
        let [, status, statusText] = statusLine.split(' ')
        this.status = status
        this.statusText = statusText
        this.responseHeaders = headerRows.reduce((memo, row) => {
          let [key, value] = row.split(': ')
          memo[key, value]
          return memo
        }, {})
        this.readyState = ReadState.HEADERS_RECEIVED
        let [,body,] = bodyRows.split('\r\n')
        this.response = this.responseText = body
        this.readyState = ReadState.LOADING
        this.onload && this.onload()
        this.readyState = DONE  // ! 一般会监听此状态
      })
    })
    this.readyState = ReadState.OPENED
  }
  setRequestHeader(header, value) {
    this.headers[header] = value
  }
  getAllResponseHeaders() {
    let result = ''
    for (let key in this.responseHeaders) {
      result += `${key}: ${this.responseHeaders[key]}`
    }
    return result
  }
  getResponseHeader(key) {
    return this.responseHeaders[key]
  }
  send(body) {
    let rows = []
    rows.push(`${this.method} ${this.url} HTTP/1.1`)
    this.headers['Content-Length'] = Buffer.byteLength(body) // 告诉服务器请求体的字节长度
    let headers = Object.keys(this.headers).map(key => `${key}: ${this.headers[key]}`) 
    rows.push(...headers)
    let request = rows.join('\r\n') + '\r\n\r\n' + body
    this.socket.write(request)
  }
}

export default XMLHttpRequest