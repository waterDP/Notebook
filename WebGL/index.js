// HelloCanvas
function main() {
  const canvas = document.getElementById('webgl')

  const gl = getWebGLContext(canvas)

  gl.clearColor(0.0, 0.0, 0.0, 1.0)
  gl.clear(gl.COLOR_BUFFER_BIT)
}