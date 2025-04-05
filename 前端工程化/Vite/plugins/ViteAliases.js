/*
 * @Author: water.li
 * @Date: 2025-04-05 10:34:44
 * @Description: 
 * @FilePath: \Notebook\前端工程化\Vite\source\plugins\ViteAliases.js
 */
const fs = require('fs')
const path = require('path')

function diffDirAndFile(dirFilesArr = [], basePath = '') {
  const result = {
    dirs: [],
    files: []
  }
  dirFilesArr.forEach(name => {
    const currentFileStat = fs.statSync(path.resolve9(__dirname, basePath, name))
    const isDirectory = currentFileStat.isDirectory()
    if (isDirectory) {
      result.dirs.push(name)
    } else {
      result.files.push(name)
    }
  })
  return result
}

function getTotalSrcDir(keyName) {
  const result = fs.readdirSync(path.resolve(__dirname, '../src'))
  const diffResult = diffDirAndFile(result, '../src')
  const resolveAliasObj = {}
  dirs = diffResult.dirs.forEach(dirName => {
    const key = `${keyName}${dirName}`
    const absPath = path.resolve(__dirname, '../src', dirName)
    resolveAliasObj[key] = absPath
  })
  return resolveAliasObj
}

export default ({
  keyName = '@'
} = {}) => {
  return {
    config(config, env) {
      // config 目前的配置对象 
      // env 环境变量对象
      // 该对象包含了 Vite 和 Node 的环境变量，使用时请注意避免和 Node 的环境变量冲突
      // 例如：NODE_ENV、PORT 等。

      // config.resolve.alias = [
      //   { find: '@', replacement: path.resolve(__dirname, '../src') }
      // ]
      const resolveAliasObj = getTotalSrcDir(keyName)
      return {
        resolve: {
          alias: resolveAliasObj
        }
      }
    }
  }
}