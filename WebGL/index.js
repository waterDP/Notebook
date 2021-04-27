// https://www.bilibili.com/video/BV14T4y1G7P8?p=3
// HelloCanvas
function main() {
  const canvas = document.getElementById('webgl')

  const gl = getWebGLContext(canvas)

  gl.clearColor(0.0, 0.0, 0.0, 1.0)
  gl.clear(gl.COLOR_BUFFER_BIT)
}