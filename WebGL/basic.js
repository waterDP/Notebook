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

// ! 顶点着色器
const vertexShader = '' +
  'void main() {' +
  // 给内置变量gl_PointSize赋值像素大小
  '  gl_PointSize=20.0;' +
  // 顶点位置，位于坐标原点
  '  gl_Position = vec4(0.0, 0.0, 0.0, 1.0)' +
  '}'

// ! 片元着色器源码
const fragShaderSource = '' +
  'void main() {' +
  // 定义片元颜色
  '  gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0)' +
  '}'

 
