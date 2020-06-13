const fs = require('fs')
const BUFFER_SIZE = 5
const buffer = Buffer.alloc(BUFFER_SIZE)

let offset = 0

fs.open('./name.txt', 'r', (err, rfd) => {
  fs.open('./name1.txt', 'w', (err, wfd) => {
    function next() {
      fs.read(rfd, buffer, 0, BUFFER_SIZE, offset, (err, bytesRead) => {
        if (!bytesRead) {
          fs.close(rfd, () => {})
          fs.close(wfd, () => {})
          return 
        }
        readOffset += bytesRead
        fs.write(wfd, buffer, 0, bytesRead, (err, written) => {
          next()
        })
      })
    }
    next()
  })
})

// 发布订阅模式
// 流：可读流  可写流
const fs = require('fs')
const rs = fs.createReadStream('./name.txt', {
  flags: 'r', // fs.open
  encoding: null, // 默认就是buffer
  mode: 0o666,
  autoClose: true, // fs.close
  emitClose: true,
  start: 0, // 包前又包后，0-3个字符，4个字节
  end: 3,
  highWaterMark: 3, // 表示的是每次读几个
})
rs.on([event_name], callback)