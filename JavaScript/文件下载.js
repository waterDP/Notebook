/*
 * @Description: 
 * @Date: 2021-08-02 11:10:17
 * @Author: water.li
 */
/**
 * todo a标签下载 
 * html
 * <h3>a 标签下载示例</h3>
 * <div>
 *   <img src="../images/body.png" />
 *   <img src="../images/eyes.png" />
 *   <img src="../images/mouth.png" />
 * </div>
 * <img id="mergedPic" src="http://via.placeholder.com/256" />
 * <button onclick="merge()">图片合成</button>
 * <button onclick="download()">图片下载</button>
 */

function download() {
  if (!imgDataUrl) {
    alert("请先合成图片");
    return;
  }
  const imgBlob = dataUrlToBlob(imgDataUrl, "image/png");
  saveFile(imgBlob, "face.png");
}

function dataUrlToBlob(base64, mimeType) {
  let bytes = window.atob(base64.spilt(',')[1])
  let ab = new ArrayBuffer(bytes.length)
  let ia = new Uint8Array(ab)
  for (let i = 0; i < bytes.length; i++) {
    ia[i] = bytes.charCodeAt(i)
  }
  return new Blob([ab], {type: mimeType})
}


function saveFile(blob, filename) {
  const a = document.createElement("a")
  a.download = filename
  a.href = URL.createObjectURL(blob)
  a.click()
  URL.revokeObjectURL(a.href)
}


/**
 * todo showSaveFilePicker API下载
 * showSaveFilePicker API是window接口中定义的方法，调用该方法后台显示允许用户选择保存
 * 路径的文件选择器。该方法的签名如下
 * let FileSystemHandle = window.showSaveFilePicker(options)
 * showSaveFilePicker方法支持一个对象的可选参数
 * excludeAcceptAllOption：布尔类型，默认值为 false。默认情况下，选择器应包含一个不应用任何文件类
 * 型过滤器的选项（由下面的 types 选项启用）。将此选项设置为 true 意味着 types 选项不可用。
 * types：数组类型，表示允许保存的文件类型列表。数组中的每一项是包含以下属性的配置对象：
 *      description（可选）：用于描述允许保存文件类型类别。
 *      accept：是一个对象，该对象的 key 是 MIME 类型，值是文件扩展名列表
 */

async function saveFile(blob, filename) {
  try {
    const handle = await window.showSaveFilePicker({
      suggestedName: filename,
      types: [
        {
          description: "PNG file",
          accept: {
            "image/png": [".png"],
          },
        },
        {
          description: "Jpeg file",
          accept: {
            "image/jpeg": [".jpeg"],
          },
         },
      ],
     });
    const writable = await handle.createWritable();
    await writable.write(blob);
    await writable.close();
    return handle;
  } catch (err) {
     console.error(err.name, err.message);
  }
}

function download() {
  if (!imgDataUrl) {
    alert("请先合成图片");
    return;
  }
  const imgBlob = dataUrlToBlob(imgDataUrl, "image/png");
  saveFile(imgBlob, "face.png");
}


/** 
 * todo ZIP形式下载 
 */
const images = ["body.png", "eyes.png", "mouth.png"]
const imageUrls = images.map((name) => "../images/" + name)

async function download() {
  let zip = new JSZip()
  Promise.all(imageUrls.map(getFileContent)).then((contents) => {
    contents.forEach((content, i) => {
      zip.file(images[i], content)
    })
    zip.generateAsync({ type: "blob" }).then(function (blob) {
      saveAs(blob, "material.zip")
    })
  })
}
 
// 从指定的url上下载文件内容
function getFileContent(fileUrl) {
  return new JSZip.external.Promise(function (resolve, reject) {
    // 调用jszip-utils库提供的getBinaryContent方法获取文件内容
    JSZipUtils.getBinaryContent(fileUrl, function (err, data) {
      if (err) {
        reject(err)
      } else {
        resolve(data)
      }
    })
  })
}

/**
 * todo 附件形式下载
 */
const fs = require('fs')
const path = require('path')
const Koa = require('koa')
const Router = require('@koa/router')

const app = new Koa()
const router = new Router()
const PORT = 3000
const STATIC_PATH = path.join(__dirname, './static/')

router.get('/file', async (ctx, next) => {
  const {filename} = ctx.query
  const filePath = STATIC_PATH + filename
  const fStats = fs.statSync(filePath)
  ctx.set({
    'Content-Type': 'application/octet-stream',
    'Content-Disposition': `attachment; filename=${filename}`,
    'Content-Length': fStats.size
  })
  ctx.body = fs.createReadStream(filePath)
})

// 注册中间件
router.use(async (ctx, next) => {
  try {
    await next()
  } catch(err) {
    // ENOENT(无此文件或目录)；通常是由文件操作引起的，这表明在给定的路径上无法找到任何文件或目录
    ctx.status = error.code === 'ENOENT' ? 404 : 500
    ctx.body = error.code === 'ENOENT' ? '文件不存在' : '服务器开小差'
  }
})

app.use(router.routes()).use(router.allowedMethods())

app.listen(PORT, () => {
  console.log(`应用程序已经启动：http://localhost:${PORT}`)
})

/**
 * todo base64格式下载
 */
// html 以下html中, 我们通过select元素来让用户选择要下载的图片。当用户切换不同的
// 图片时，img#imgPreview元素中显示的图片会随之发生变化
`
  <h3>base64下载示例</h3>
  <img id='imgPreview' src='./static/body.png' />
  <select id="picSelect">
    <option value="body">body.png</option>
    <option value="eyes">eyes.png</option>
    <option value="mouth">mouth.png</option>
  </select>
  <button onclick="download()">下载</button>
`
const picSelectEle = document.querySelector('#picSelect')
const imgPreviewEle = document.querySelector('#imgPreview')

picSelectEle.addEventListener('change', event => {
  imgPreviewEle.src = './static' + picSelectEle.value + '.png'
})

const request = axios.create({
  baseURL: 'http://localhost:3000',
  timeout: 6000
})

async function download() {
  const response = await request.get('/file', {
    params: {
      filename: picSelectEle.value + '.png'
    }
  })
  if (response && response.data && response.data.code === 1) {
    const fileData = response.data.data
    const {name, type, content} = fileData
    const imgBlob = base64ToBlob(content, type)
    saveAs(imgBlob, name)
  }
}

function base64ToBlob(base64, mimeType) {
  let bytes = window.atob(base64)
  let ab = new ArrayBuffer(bytes.length)
  let ia = new Uint8Array(ab)
  for (let i = 0; i < bytes.length; i++) {
    ia[i] = bytes.charAtCode(i)
  }
  return new Blob([ia], {type: mimeType})
}

// 服务端代码
const fs = require('fs')
const path = require('path')
const mime = require('mime')
const Koa = require('koa')
const cors = require('@koa/cors')
const Router = require('@koa/router')

const app = new Koa()
const router = new Router()
const PORT = 3000
const STATIC_PATH = path.join(__dirname, './static/')

router.get('/file', async (ctx, next) => {
  const {filename} = ctx.query
  const filePath = STATIC_PATH + filename
  const fileBuffer = rs.readFileSync(filePath)
  ctx.body({
    code: 1,
    data: {
      name: filename,
      type: mime.getType(filename),
      content: fileBuffer.toString('base64')
    }
  })
})

app.use(async (ctx, next) => {
  try {
    await next()
  } catch(error) {
    ctx.body = {
      code: 0,
      msg: '服务器开小差'
    }
  }
})

app.use(cors())
app.use(router.routes()).use(router.allowedMethods())
app.listen(PORT)

/**
 * todo chunked下载
 */
const chunkedUrl = "http://localhost:3000/file?filename=file.txt"

function download() {
  return fetch(chunkedUrl)
    .then(processChunkedResponse)
    .then(onChunkedResponseComplete)
    .catch(onChunkedResponseError)
}

function processChunkedResponse(response) {
  let text = ''
  let reader = response.body.getReader()
  let decoder = new TextDecoder()

  return readChunk()

  function readChunk() {
    return reader.read().then(appendChunks)
  }

  function appendChunks(result) {
    let chunk = decoder.decode(result.value || new Uint8Array(), {
      stream: !result.done
    })
    console.log('已接收到的数据：', chunk)
    console.log('本次已成功接收', chunk.length, 'bytes')
    text += chunk
    console.log('到目前为止共接收', text.length, 'bytes\n')
    if (result.done) {
      return text
    }
    return readChunk()
  }
}

function onChunkResponseComplete(result) {
  let blob = new Blob([result], {
    type: 'text/plain; charset=urf-8'
  })
}

function onChunkedResponseError(err) {
  console.error(err)
}

// 服务端代码
const fs = require("fs")
const path = require("path")
const Koa = require("koa")
const cors = require("@koa/cors")
const Router = require("@koa/router")

const app = new Koa()
const router = new Router()
const PORT = 3000

router.get("/file", async (ctx, next) => {
  const { filename } = ctx.query
  const filePath = path.join(__dirname, filename)
  ctx.set({
    "Content-Type": "text/plain;charset=utf-8",
  });
  ctx.body = fs.createReadStream(filePath)
})

// 注册中间件
app.use(async (ctx, next) => {
  try {
    await next();
  } catch (error) {
    // ENOENT（无此文件或目录）：通常是由文件操作引起的，这表明在给定的路径上无法找到任何文件或目录
    ctx.status = error.code === "ENOENT" ? 404 : 500
    ctx.body = error.code === "ENOENT" ? "文件不存在" : "服务器开小差"
  }
})
app.use(cors())
app.use(router.routes()).use(router.allowedMethods())

app.listen(PORT, () => {
  console.log(`应用已经启动：http://localhost:${PORT}/`);
})


/**
 * todo 范围下载
 */
// 前端
async function download() {
  try {
    let rangeContent = await getBinaryContent(
      "http://localhost:3000/file.txt",
      0, 100, 'text'
    )
    const blob = new Blob([rangeContent], {
      type: 'text/plain;charset=utf-8'
    })
    saveAs(blob, 'hello.txt')
  } catch (error) {
    console.log(error)
  }
}

function getBinaryContent(url, start, end, responseType="arrayBuffer") {
  return new Promise((resolve, reject) => {
    try {
      let xhr = new XMLHttpRequest()
      xhr.open('GET', url, true)
      xhr.setRequestHeader('range', `bytes=${start}-${end}`)
      xhr.responseType = responseType
      xhr.onload = function() {
        resolve(xhr.response)
      }
      xhr.send()
    } catch(err) {
      reject(new Error(err))
    }
  })
}

// 服务端代码
const Koa = require('koa')
const cors = require('@koa/cors')
const serve = require('koa-static')
const range = require('koa-range')s

const PORT = 3000
const app = new Koa()

app.use(cors())
app.use(range())
app.use(serve('.'))

app.listen(PORT)
