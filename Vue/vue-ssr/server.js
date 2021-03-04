/*
 * @Description: 
 * @Date: 2021-03-03 16:44:18
 * @Author: water.li
 */

const express = require('express')
const app = express()
const fs = require('fs')

const VueServerRender = require('vue-server-renderer')

// 模板
const template = fs.readFileSync('./dist/index.ssr.html', 'utf8')
// 内容
// const serverBundle = fs.readFileSync('./dist/server.bundle.js', 'utf8')
let serverBundle = require('./dist/vue-ssr-server-bundle.json')

let clientManifest = require('./dist/vue-ssr-client-manifest.json')

const render = VueServerRender.createBundleRenderer(serverBundle, {
  template,
  clientManifest
})

app.get('/', (req, res) => {
  const context = {url: req.url}
  // 把渲染成功的字符串扔给客户端
  render.renderToString(context, (err, html) => {
    res.send(html)
  })
})
// 顺序要保证，放在get后
app.use(express.static(path.resolve(__dirname, 'dist')))

// 如果访问的路径不存在，默认渲染index.ssr.html 并且把路由定向到当前请求的路径
app.get('*', (req, res) => {
  const context = {url: req.url}
  // 把渲染成功的字符串扔给客户端
  render.renderToString(context, (err, html) => {
    res.send(html)
  })
})

app.listen(3000)