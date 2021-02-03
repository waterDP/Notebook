// Canvas base Api

// 获取2d环境 
const theCanvas = document.getElementById('canvas')
const context  = theCanvas.getContext('2d')

/**
 * todo 全局属性
 */
// ! 填充颜色
context.fillStyle = '#ffffaa'
// ! 边框颜色
context.strokeStyle = '#ffffaa'
// ! 透明度
context.globalAlpha = alpha
// ! 字体大小和字体
context.font = '20px Sans-Serif'
// ! 字体的垂直对齐方式
context.textBaseline = 'top'
// ! 字体的垂直对齐方式
context.textBaseline = 'top'
// ! 阴影相关
context.shadowBlur
context.shadowColor
context.shadowOffsetX
context.shadowOffsetY

// ! 线的粗细
context.lineWidth = 10


// todo 当前状态的保存与恢复
context.save()
context.restore()

/**
 *  todo 绘制图像
 */

// 绘制一个方块
context.fillReact(x, y, width, height)
// 描边一个方块
context.strokeRect(x, y, width, height)
// 清除一个方块内的内容
context.clearRect(x, y, width, height)

// 绘制文字
context.fillText('text', x, y, maxWidth)

// 绘图
const img = new Image()
img.onload = () => {
  context.drawImage(img, dX, dY, dWidth, dHeight)
}
img.src = 'img.gif'


/**
 * todo 绘制路径
 */
/**
 * @description: 弧线 
 * @param {*} xy 定义圆心
 * @param radius 定义弧线半径
 * @param startAngle endAngle 开始与结束角度 弧度缺点
 * @param anticlockwise 方向
 */
context.arc(x, y, radius, Math.PI / 180 * startAngle, Math.PI / 180 * endAngle, anticlockwise)

context.arcTo(x1, y1, x2, y2, radius);


// 简单直线路径
function drawScreen() {
  context.strokeStyle = 'black'
  context.lineWidth= 10
  context.lineCap='square'
  context.beginPath()
  context.moveTo(20, 0)
  context.lineTo(100, 0)
  context.stroke() // 描边
  context.closePath()
}

// ! 贝塞尔曲线
context.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y);
context.quadraticCurveTo(cpx, cpy, x, y);


// todo 渐变
context.createLinearGradient(x1, y1, x2, y2)  //  线性渐变
context.createRadialGradient(x1, y1, r1, x2, y2, r2) // 径向渐变

// todo 渐变色设置
// 水平渐变
function drawScreen() {
  let gr = context.createLinearGradient(0, 0, 100, 0)
  // 添加颜色点
  gr.addColorStop(0, 'rgb(255,0,0)');
  gr.addColorStop(0.5, 'rgb(0,255,0)')
  gr.addColorStop(1, 'rgb(0,0,255)')
  // 应用fillStyle生成渐变
  context.fillStyle = gr
  context.fillReact(0, 0, 100, 100)
}


