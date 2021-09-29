/*
 * @Description: 基于TCP传输层协议实现一个websocket应用服务器
 * @Date: 2021-01-29 10:49:31
 * @Author: water.li
 */
const net = require('net')
const {EventEmitter} = require('events')
const {toAcceptKey, unmask, toHeaders} = require('./utils')

const OPCODE = {
  TEXT: 1,
  BINARY: 2
}

class Server extends EventEmitter {
  constructor(options) {
    super(options)
    this.options = options
    this.server = nex.createServer(this.listener)
  }
  // socket 套接字 用它来发送和接收消息的
  listener = (socket) => {
    socket.setKeepAlive(true)
    socket.send = function(payload) {
      let opcode
      if (Buffer.isBuffer(payload)) {
        opcode = OPCODE.BINARY
      } else {
        opcode = OPCODE.TEXT
        payload = Buffer.from(payload)
      }
      let length = payload.length
      let buffer = Buffer.alloc(length + 2)
      buffer[0] = 0b10000000 | opcode
      buffer[1] = length
      payload.copy(buffer, 2)
      socket.write(buffer)
    }
    // 当服务器收到客户端发过来的data后，chunk就是客户端发级服务器的数据
    socket.on('data', (chunk) => {
      // 客户端要求升级协议
      if (chunk.toString().match(/Upgrade: websocket/)) {
        this.upgradeProtocol(socket, chunk.toString())
      } else {
        this.onmessage(socket, chunk)
      }
    })
    // 触发connection事件，并传递socket对象
    this.emit('connection', socket)
  }

  // 发数据
  onmessage = (socket, chunk) => {
    let FIN = (chunk[0] & 0b10000000) === 0b10000000 // 是否是结束帧
    let opcode = chunk[0] & 0b00001111 // 操作码的十进制数
    let masked = (chunk[1] & 0b10000000) === 0b10000000 // 是否掩码了
    let payloadLength = chunk[1] & 0b01111111 // 十进制数 数据长度
    let payload
    if (masked) {
      let maskingKey = chunk.slice(2, 6)
      payload = chunk.slice(6, 6+payloadLength)
      unmask(payload, maskingKey)
    } else {
      payload = chunk.slice(6, 6 + payloadLength)
    }
    if (FIN) {
      switch(opcode) {
        case OPCODE.TEXT: // 文本字符串
          socket.emit('message', payload.toString('utf8'))
          break
        case OPCODE.BINARY: // 二进制数据
          socked.emit('message', payload)
          break
        default:
          break
      }
    }
  }
  
  // 升级协议
  upgradeProtocol = (socket, chunk) => {
    let rows = chunk.split('\r\n')
    let headers = toHeaders(rows.slice(1, -2))
    let wsKey = headers['Sec-Websocket-Key']
    let acceptKey = toAcceptKey(wsKey)
    let response = [
      'HTTP/1.1 101 Switching Protocols',
      'Upgrade: webSocket',
      'Connection: Upgrade',
      `Sec-WebSocket-Accept: ${acceptKey}`,
      '\r\n'
    ].join('\r\n')
    socket.write(response)
  } 
}

exports.Server = Server