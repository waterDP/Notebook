/**
 * 0x 表示十六进制
 * 0b 表示二进进制
 * 0  表示八进制
 */

// todo 声明方式  内存，大小不能发生变化
/**
 * 1.可以通过数字
 * 2.通过字符
 * 3.通过数组
 */
let buffer = Buffer.alloc(10)
let bufferS = Buffer.from('珠峰') // utf8 一个汉字是三个字符
let bufferA = Buffer.from([0xe7, 0x8f, 0xa0])

// todo 实现前端下载html的功能
let str = `<h1>hello world</h1>`
const blob = new Blob([str], {
  type: 'text/html'
})
let a = document.createElement('a')
a.setAttribute('download', 'a.html')
a.innerHTML = '下载'
// 通过blob产生一个临时访问的链接
a.href = URL.createObjectURL(blob)
document.body.appendChild(a)


// todo 预览功能
`<input type='file' id='file' />`
file.addEventListener('change', e => {
  let file = e.target.files[0]
  let r = URL.createObjectURL(file)
  let img = document.appendChild('img') 
  img.src = r
  document.body.appendChild(img)
  // URL.revokeObjectURL(r)
})

// todo 发个请求 服务端返回给我一个文件，实现下载即可
function request(url, method = 'get') {
  return new Promise((resolve, reject) => {
    let xhr = new XMLHttpRequest()
    xhr.open(method, url, true)
    xhr.responseType = 'arraybuffer'
    xhr.onload = function() {
      resolve(xhr.response)
    }
    xhr.send()
  })
}
request('/download').then(arrayBuffer => {
  let b = new Blob([arrayBuffer])  // 直接将arrayBuffer封装成文件
  let blobUrl = URL.createObjectURL(b)
  let a = document.createElement('a')
  a.href = blobUrl
  Document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL()
})


// todo buffer 操作
let buffer = buffer.from('珠峰')
let buf1 = buffer.slice(0, 3)
buf1[0] = 100 // 特点是默认截取出来的是内在空间，所以更改后原来的buffer也会发生变化

console.log(buffer.length)  // 指代的是字节长度，不是字符串的长度
Buffer.isBuffer(buf1) // 判断是不是Buffer

// 实现扩容，就是找一个更大的空间，将现在的buffer拷贝进去
let buffer1 = Buffer.from('珠峰')
let buffer2 = Buffer.from('架构')
let buff = Buffer.alloc(buffer1.length + buffer2.length)
buffer1.copy(buff, 6, 0, 6)
buffer2.copy(buff, 0, 0, 6)
console.log(buff.toString())

let buffer = Buffer.concat([buffer1, buffer2], 9)
console.log(buffer.toString())

// Buffer.split
Buffer.prototype.split = function (sep) {
  let len = Buffer.from(sep).length
  let offset = 0
  let arr = []
  let currentIndex = 0 // 当前找到时的索引位置
  while(-1 !== (currentIndex = this.indexOf(sep, offset))) {
    arr.push(this.slice(offset, currentIndex))
    offset = currentIndex + len
  }
  arr.push(this.slice(offset))
  return arr  
}


