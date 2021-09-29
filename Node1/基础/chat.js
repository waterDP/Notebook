const net = require('net')

// 创建一个服务器
// 广播 b:内容 此客户端想要向所有的其它客户端主播
// 私聊 c:对方的用户名：内容 想向指定的用户名发消息
// 列出在线用户列表 l 列出所有的用户信息|
// 修改呢称 n:新名字

let clients = {} 
let server = net.createServer((socket) => {
  let key = socket.remoteAddress + socket.remotePort
  clients[key] = {
    nickname: '匿名',
    socket
  }
  socket.setEncoding('utf8')
  socket.on('data', data => {
    data = data.replace(/\r\n/, '')
    let type = data.split(':')[0]
    switch(type) {
      case 'b':
        let text = data.split(':')[1]
        broadcast(text)
        break
      case 'c':
        let values = data.split(':')
        let toUser = values[1]
        let toText = values[2]
        sendTo(toUser, toText)
        break
      case 'l':
        list()
        break     
      case 'n':
        let newName = data.split(':').slice(2)
        let oldUserObj = client[key]
        oldUserObj.nickname = newName
        socket.write('你的用户名已经修改为：' + newName + '\r\n')
        break
      default:
        socket.write('此命令不能识别，请重新输入！\r\n')
        break  
    }
  })
  socket.on('end', () => {
    socket.destroy()
    delete clients[key]
  })

  function broadcast(text) {
    let {nickname} = clients[key]
    for (let user in clients) {
      if (clients.hasOwnProperty(user) && user !== key) {
        clients[user].socket.write(`${nickname}:${text}\r\n`)
      }
    }
  }

  function sendTo(toUser, text) {
    let toUserObj 
    let {nickname} = clients[key]
    for (let user in clients) {
      if (clients[user].nickname === toUser) {
        toUserObj = client[user]
      }
    } 
    if (toUserObj) {
      toUserObj.socket.write(`${nickname}:${text}`)
    } else {
      socket.write('用户名不正确或者对方已经下线！\r\n')
    }
  }

  function list() {
    let result = '在线用户列表\r\n'
    for (let user in clients) {
      result += clients[user].nickname + '\r\n'
    }
    socket.write(result)
  }
})
server.listen(8080)