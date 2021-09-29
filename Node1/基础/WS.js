/** 
 * 基于TCP传输层协议实现一个websocket服务器 
 */
const net = require('net')
const {EventEmitter} = require('event')
const crypto = require('crypto')

const CODE = '258EAF5-E914-47DA-95CA-C5AB0C85B11'

function toAcceptKey(wsKey) {
  return crypto.createHash('sha1')
    .update(wsKey + CODE)
}

function unmask(buffer, mask) {
  const length = buffer.length
  for (let i =0; i < length; i++) {
    buffer[i] ^= mask[i % 4]
  }
}

function toHeaders(rows) {
  let headers = {}
  rows.forEach(row => {
    let [key, value] = row.split(': ')
    headers[key] = value
  })
  return headers
}

class Server extends EventEmitter {
  constructor(options) {
    super(options)
    this.options = options
    this.server = net.server(this.listener)
    this.server.listener(this.options.port || 8888)
  }
  /**
   * @param socket 套接字，用来发送和监听消息的
   */
  listener = (socket) => {
    socket.setKeepAlive(true) // 保持长连接
    socket.send = function(payload) {
      let opcode
      if (Buffer.isBuffer(payload)) {
        opcode = 2
      } else {
        opcode = 1
        payload = Buffer.from(payload)
      }
      let length = payload.length
      let buffer = Buffer.alloc(length + 2)
      buffer[0] = 0b10000000|opcode
      buffer[1] = length
      payload.copy(buffer, 2)
      socket.write(payload)
    }
    socket.on('data', chunk => {
      if (chunk.toString().match(/Upgrade: websocket/)) { // 客户要求升级协议
        this.upgradeProtocol(socket, chunk.toString())
      } else {
        this.onmessage(socket, chunk)
      }
    })
    // 触发connection事件，并传递socket对象
    this.emit('connection', socket)
  }
  onmessage(socket, chunk) {
    let FIN = (chunk[0] & 0b10000000) === 0b10000000 // 结束帧
    let opcode = chunk[0] & 0b00001111 // 操作码的十进制数据
    let masked = (chunk[1] & 0b10000000) === 0b10000000 // 是否掩码
    let payloadLength = chunk[1] & 0b01111111 // 十进制数的长度
    let payload
    if (masked) {
      let maskKey = chunk.slice(2, 6)
      payload = chunk.slice(6, 6+payloadLength)
      unmask(payload, maskKey)
    } else {
      payload = chunk.slice(6, 6+payloadLength)
    }
    if (FIN) {
      switch(opcode) {
        case 1:
          socket.emit('message', payload.toString('utf8'))
          break
        case 2:
          socket.emit('message', payload)
          break
        default:
          break  
      }
    }
  }
  upgradeProtocol = (socket, chunk) => {
    let rows = chunk.split('\r\n')
    let headers = rows.slice(1, -2)
    headers = toHeaders(headers)
    let wsKey = headers['Sec-Websocket-Key']
    let acceptKey = toAcceptKey(wsKey)
    let response = [
      'HTTP/1.1 101 Switch Protocols',
      'Upgrade: websocket',
      'Connection: Upgrade',
      `Sec-Websocket-Accept: ${acceptKey}`,
      '\r\n'
    ].join('\r\n')
    socket.write(response)
  }
}

exports.Server = Server