// worker 
// self = window
self.importScripts('https://cdn.bootcss.com/spark-md5/3.0.0/spark-md5.js')

self.onmessage = async event => {
  const {partList} = event.data
  const spark = new self.SparkMD5.ArrayBuffer()
  let percent = 0 //总体计算hash的百分比
  let perSize = 100 / partList.length //每计算完一个part,相当于完成了百分之几 25%
  
  const mapPartListToPromise = partList.map(({chunk, size}) => (
    new Promise(resolve => {
      const reader = new FileReader()
      reader.readAsArrayBuffer(chunk)
      reader.onload = event => {
        percent += perSize
        self.postMessage({percent: Number(percent.toFixed(2))})
        resolve(event.target.result)
      }
    })
  ))
  
  const buffers = await Promise.all(mapPartListToPromise)
  buffers.forEach(buffer => spark.append(buffer))
  self.postMessage({percent: 100, hash: spark.end()})
  self.close()
}