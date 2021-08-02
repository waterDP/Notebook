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