const express = require('express')
const logger = require('morgan') // 日志
const cors = require('cors')
const { INTERNAL_SERVER_ERROR } = require('http-status-code') // 500
const createError = require('http-errors')
const path = require('path')
const fs = require('fs-extra') // fs 加强版
const { mergeChunks } = require('chunks')

const CHUNK_SIZE = 1024 * 1024 * 10
const PUBLIC_DIR = path.resolve(__dirname, 'public')
const TEMP_DIR = path.resolve(__dirname, 'temp')

const app = express()

app.use(logger('dev')) // 日志
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(cors()) // 跨域处理
app.use(express.static(path.resolve(__dirname, 'public')))

// 文件上传
app.post('/upload/:filename/:chunk_name/:start', async (req, res) => {
  let {filename, chunk_name, start} = req.params
  start = Number(start)
  let chunk_dir = path.resolve(TEMP_DIR, filename)
  let exist = await fs.pathExists(chunk_dir)
  if (!exist) {
    await fs.mkdirs(chunk_dir)
  }
  let chunkFilePath = path.resolve(chunk_dir, chunk_name)
  let ws = fs.createWriteStream(chunkFilePath, { start, flags: 'a' })
  req.on('end', () => {
    res.json({success: true})
  })
  ['end', 'close', 'close'].forEach(event => {
    req.on(event, () => {
      res.close()
    })
  })
  req.pipe(ws)
})

// 计算hash值
app.get('/verify/:filename', (req, res) => {
  let {filename} = req.params
  let filePath = path.resolve(PUBLIC_DIR, filename)
  let existFile = await fs.pathExists(filePath)
  if (existFile) {
    return {
      success: true,
      needUpload: false // 因为已经上传过了，所以不再需要上传了，可现实现秒传
    }
  }
  let tempDir = path.resolve(TEMP_DIR, filename)
  let exist = await fs.pathExists(tempDir)
  let uploadList = []
  if (exist) { // 部分已经上传过了
    uploadList = await fs.readdir(tempDir)
    let mapListToPromise = uploadList.map(async filename => {
      let stat = await fs.stat(path.resolve(tempDir, filename))
      return {
        filename,
        size: stat.size
      }
    })
    uploadList = await Promise.all(mapListToPromise)
  }

  res.json({
    success: true,
    needUpload: true,
    uploadList  // 已经上传过的文件列表
  })
})

// 组装分片请求
app.get('/merge/:filename', (req, res) => {
  let {filename} = req.params
  await mergeChunks(filename)
  res.json({success: true})
})

// 404
app.use((req, res, next) => {
  next(createError(404))
})

// 错误处理中间件
app.use((error, req, res, next) => {
  res.status(error.status || INTERNAL_SERVER_ERROR)
  res.json({
    success: false,
    error
  })
})


module.exports = app