/*
 * @Description: 
 * @Date: 2021-07-14 13:43:03
 * @Author: water.li
 */


/**
 * todo 单文件上传
 *   <input id="uploadFile" type="file" accept="image/*" />
 *   <button id="submit" onclick="uploadFile()">上传文件</button>
 */
const uploadFile = document.querySelector('#uploadFile')

const request = axios.create({
  baseUrl: 'http://...',
  timeout: 6000
})

async function uploadFile() {
  if (!uploadFile.files.length) return 
  const file = uploadFile.files[0]
  

  uploadFile({
    url: '/single',
    file
  })
}

function upload({url, file, filename = 'file'}) {
  let formData = new FormData()
  formData.set(filename, file)
  request.post(url, formData, {
    // 监听上传进度
    opUploadProgress: progressEvent => {
      const percentCompleted = Math.round(
        progressEvent.loaded * 100 / progressEvent.total
      )
      console.log(percentCompleted)
    }
  })
}

/**
 * todo 多文件上传
 *   <input id="uploadFile" type="file" accept="image/*" multiple>
 *   <button id="submit" onclick="uploadFile">上传文件</button>
 */
async function uploadFile() {
  if (!uploadFileEle.files.length) return
  const files = Array.from(uploadFileEle.files)
  upload({
    url: '',
    files
  })
}

function upload({url, files, fieldName = 'file'}) {
  let formData = new FormData()
  files.forEach(file => {
    formData.append(fieldName, file)
  })
  request.post(url, formData, {
    onUploadProgress: progressEvent => {
      const percentCompleted = Math.round(
        progressEvent.loaded * 100 / progressEvent.total
      )
    }
  })
}

/**
 * 目录上传
 * <input id="uploadFile" type="file" accept="accept/" webkitdirectory />
 */
function upload({url, files, fieldName = 'file'}) {
  let formData = new FormData()
  files.forEach((file, idx) => {
    formData.append(
      fieldName,
      files[idx],
      files[idx].webkitRelativePath.replace(/\//g, '@')
    )
  })

  request.post(url, formData)
}

/**
 * todo 压缩目录上传
 */
function generateZipFile({
  zipName, files,
  options = {type: 'blob', compression: 'DEFLATE'}
}) {
  return new Promise((resolve, reject) => {
    const zip = new JSZip()
    for (let i = 0; i < files.length; i++) {
      zip.file(files[i].webkitRelativePath, files[i])
    }
    zip.generateAsync(options).then(blob => {
      zipName = zipName || Date.now() + '.zip'
      const zipFile = new File([blob], zipName, {
        type: 'application/zip'
      })
      resolve(zipFile)
    })
  })
}

async function uploadFile() {
  let fileList = uploadFileEle.files
  if (!fileList.length) return
  let webkitRelativePath = fileList[0].webkitRelativePath
  let zipFileName = webkitRelativePath.split('/')[0]+'.zip'
  let zipFile = await generateZipFile(zipFileName, fileList)
  upload({
    url,
    file: zipFile,
    fileName: zipFileName
  })
}


/**
 * todo 拖拽上传
 * 要实现拖拽上传的功能，我们需要先了解与拖拽相关的事件
 * dragenter: 当拖拽元素或选中文本到时一个可释放目标时触发
 * dragover:  当元素或选中的文本被拖到一个可释放目标上时触发
 * dragover:  当拖拽元素或选中的文本离开一个可释放目标时触发
 * drop: 当元素或选中的文本在可释放目标上释放时触发
 * 
 * <div id="dropArea">
 *   <p>拖拽上传文件</p>
 *   <div id="imagePreview"></div>
 * </div>
 */
// ! 1.阻止默认拖拽行为
const dropAreaEle = document.querySelector('#dropArea')
const imgPreviewEle = document.querySelector('#imagePreview')
const IMAGE_MIME_REGEX = /^image\/(jpe?g|gif|png)$/i

['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
  dropAreaEle.addEventListener(eventName, preventDefaults, false)
  document.body.addEventListener(eventName, preventDefaults, false)
})

function preventDefaults(e) {
  e.preventDefault()
  e.stopPropagation()
}

// ! 2.切换目标区域的高亮状态
["dragenter", "dragover"].forEach((eventName) => {
    dropAreaEle.addEventListener(eventName, highlight, false);
})
["dragleave", "drop"].forEach((eventName) => {
    dropAreaEle.addEventListener(eventName, unhighlight, false);
})

// 添加高亮样式
function highlight(e) {
  dropAreaEle.classList.add("highlighted");
}

// 移除高亮样式
function unhighlight(e) {
  dropAreaEle.classList.remove("highlighted");
}

// ! 3.处理图片预览
dropAreaEle.addEventListener('drop', handleDrop, false)

function handleDrop(e) {
  const dt = e.dataTransfer
  const files = [...dt.files]
  files.forEach(file => previewImg(file, imgPreviewEle))
  // 文件上传
}

function previewImage(file, container) {
  if (IMAGE_MIME_REGEX.test(file.type)) {
    const reader = new FileReader()
    reader.onload = e => {
      let img = document.createElement('img')
      img.src = e.target.result
      container.append(img)
    }
    reader.readerAsDataURL(file)
  }
}

/**
 * todo 剪贴板上传
 * 要实现剪贴板上传的功能，可以分为以下3个步骤
 * 1.监听容器的粘贴事件
 * 2.读取并解析剪贴板中的内容
 * 3.动态构建FormData对象并上传
 * 
 * <div id="uploadArea">
 *   <p>请先复制图片后再执行粘贴操作</p>
 * </div>
 */

const IMAGE_MIME_REGEX = /^image\/(jpe?g|gif|png)$/i
const uploadAreaEle = document.querySelector("#uploadArea")

uploadAreaEle.addEventListener('paste', async e => {
  e.preventDefault()
  const files = []
  if (navigator.clipboard) {
    let clipboardItems = await navigator.clipboard.readText()
    for (const clipboardItem of clipboardItems) {
      for (const type of  clipboardItem.types) {
        if (IMAGE_MIME_REGEX.test(type)) {
          const blob = await clipboardItem.getType(type)
          insertImage(blob, uploadAreaEle)
          files.push(blob)
        }
      }
    }
  } else {
    const items = e.clipboardData.items;
    for (let i = 0; i < items.length; i++) {
      if (IMAGE_MIME_REGEX.test(items[i].type)) {
        let file = items[i].getAsFile();
        insertImage(file, uploadAreaEle);
        files.push(file);
      }
    }
  }

  if (files.length) {
    // 上传
  }
})