// Canvas base Api

// 获取2d环境 
const theCanvas = document.getElementById('canvas')
const context  = theCanvas.getContext('2d')

// fillStyle()设置填充颜色
context.fillStyle = '#ffffaa'

// 绘制一个方块
context.fillReact(0, 0, 500, 300)

/**
 *  todo 字体
 */
// 设置字体大小和字体
context.font = '20px Sans-Serif'

// 设置字体的垂直对齐方式
context.textBaseline = 'top'

// 绘制文字
context.fillText('text', x, y, maxWidth)

// 绘图
const img = new Image()
img.onload = () => {
  context.drawImage(img, dX, dY, dWidth, dHeight)
}
img.src = 'img.gif'
