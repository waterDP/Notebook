// https://www.bilibili.com/video/BV14T4y1G7P8?p=3


function main() {
  const canvas = document.getElementById('webgl')

  const webgl = canvas.getContext('webgl')

  webgl.clearColor(0.0, 0.0, 0.0, 1.0)
  webgl.clear(gl.COLOR_BUFFER_BIT)
}

// ! 顶点缓冲区
let jsArrayData = [
  0.0, 1.0, 0.0,
  -1.0, -1.0, 0.0,
  1.0, -1.0, 0.0
]

let triangleBuffer = webgl.createBuffer()
webgl.bindBuffer(webgl.ARRAY_BUFFER, triangleBuffer)
webgl.bufferData(webgl.ARRAY_BUFFER, new Float32Array(jsArrayData), webgl.STATIC_DRAW)
webgl.bufferSubData(webgl.ARRAY_BUFFER, 0, new Float32Array(jsArrayData)) // 更改

// 2.索引缓冲区
// 3.纹理缓冲区
// 4.帧缓冲区
// 5.深度缓冲区
// 6.颜色缓冲区
// 7.模板缓冲区


// 1.模型矩阵
// 2.观察矩阵
// 3.投影矩阵
// 4.视口变换矩阵