// fs 中 stream 可以有方向 而且可以不关心整体内容 我可以分段记取

let fs = require('fs')
//  rs 是可读流对象

// r+ 以读取为准 文件不存在 报错
// w+ 以写为准   文件不存在 创建
let rs = fs.createReadStream('./b', {
  flags: 'r',
  encoding: null,
  mode: 0o666,   // 模式 可读可写
  autoClose: true,
  start: 0,
  end: 5, // 包前也包后
  highWaterMark: 2 // 每次读几个
})

let arr = []
// !文件流特有的事件 
rs.on('open', () => {})
// !文件流特有的事件 
rs.on('close', () => {})
rs.on('data', data => {
  arr.push(data)
})
rs.on('end', () => {
  console.log(Buffer.concat(arr).toString())
})
rs.on('error', err => {
  throw err
})
rs.pause()  // ! 暂停流
rs.resume() // ! 恢复流


