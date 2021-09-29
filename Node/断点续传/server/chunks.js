const path = require('path')
const fs = require('fs-extra')

const CHUNK_SIZE = 1024 * 1024 * 10
const PUBLIC_DIR = path.resolve(__dirname, 'public')
const TEMP_DIR = path.resolve(__dirname, 'temp')

const pipeStream = (filePath, ws) => {
  return new Promise(async resolve => {
    let rs = fs.createReadStream(filePath)
    rs.on('end', () => {
      await fs.unlink(filePath)
      resolve()
    })
    rs.pipe(ws)
  })
}

async function splitChunks(filename, size = CHUNK_SIZE) {
  const filePath = path.resolve(__dirname, filename)
  const chunksDir = path.resolve(TEMP_DIR, filename)
  await fs.mkdirp(chunksDir)
  const content = await fs.readFile(filePath)
  let i = 0, current = 0, length = content.length
  while (current < length) {
    await fs.writeFile(
      path.resolve(chunksDir, filename + '-' + i),
      content.slice(current, current + size)
    )
    i++
    current += size
  }
}

async function mergeChunks(filename, size = CHUNK_SIZE) {
  const filePath = path.resolve(PUBLIC_DIR, filename)
  const chunksDir = path.resolve(TEMP_DIR, filename)
  const chunkFiles = await fs.readdir(chunksDir)
  //按文件名升序排列
  chunkFiles.sort((a, b) => Number(a.split('-')[1]) - Number(b.split('-')[1]))
  const mapChunkFile = chunkFiles.map((chunkFile, index) => (
    pipeStream(
      path.resolve(chunksDir, chunkFile),
      fs.createWriteStream(filePath, {
          start: index * size
      })
  )))
  await Promise.all(mapChunkFile)
  await fs.rmdir(chunksDir)
}

module.exports = {
  splitChunks,
  mergeChunks
}