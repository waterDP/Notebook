/*
 * @Description: 
 * @Date: 2021-01-29 09:44:14
 * @Author: water.li
 */
const {Server} = require('ws')
const wsServer = new Server({
  port: 8888
})

wsServer.on('connect', socket => {
  socket.on('message', (msg) => {
    console.log(msg)
    socket.send(message)
  })
})