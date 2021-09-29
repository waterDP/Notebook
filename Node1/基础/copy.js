const fs = require('fs')
const path = require('path')

function copy(source, target, callback) {
  const BUFFER_SIZE = 5
  const buffer = Buffer.alloc(BUFFER_SIZE)
  let readOffset = 0
  let writeOffset = 0
  fs.open(source, 'r', (err, rfd) => {
    if (err) return callback(err)
    fs.open(target, 'w', (err, wfd) => {
      if (err) return callback(err)
      function next() {
        fs.read(rfd, buffer, 0, BUFFER_SIZE, readOffset, (err, bytesRead) => {
          if (err) return callback(err)
          readOffset += bytesRead
          fs.write(wfd, buffer, 0, bytesRead, writeOffset, (err, written) => {
            if (err) return callback(err)
            writeOffset += written
            if (bytesRead === BUFFER_SIZE) {
              next()
            } else {
              fs.close(rfd, () => {})
              fs.close(wfd, () => {})
              callback() 
            }
          })
        })
      }
      next()
    })
  })
}

copy(
  path.resolve(__dirname, 'name.txt'),
  path.resolve(__dirname, 'copy.txt'),
  err => {
    if (err) {
      return console.log(err)
    }
    console.log('拷贝成功')
  }
)

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