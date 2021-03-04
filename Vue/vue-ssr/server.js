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
const serverBundle = fs.readFileSync('./dist/server.bundle.js', 'utf8')

const render = VueServerRender.createBundleRenderer(serverBundle, {
  template
})

app.get('/', (req, res) => {
  // 把渲染成功的字符串扔给客户端
  render.renderToString((err, html) => {
    res.send(html)
  })
})
// 顺序要保证，放在get后
app.use(express.static(path.resolve(__dirname, 'dist')))

app.listen(3000)