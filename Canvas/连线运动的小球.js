/*
 * @Author: water.li
 * @Date: 2021-11-29 15:36:33
 * @Description: 
 * @FilePath: \notebook\Canvas\连线运动的小球.js
 */
let canvas = document.getElementById('canvas')
let ctx = canvas.getContext('2d')
const ctxW = 500
const ctxH = 500

class Ball {
  constructor(text) {
    this.x = r(380)+60
    this.y = r(380)+60
    this.r = r(20) + 10
    this.color = '#' + parseInt(Math.random()*0xffffff).toString(16)
    this.xSpeed = r(10) + 4
    this.ySpeed = r(10) + 1

    this.text = text
  }
  show() {
    this.run()
    drawCircle(this.x, this.y, this.r, this.color)
    drawText(this.text, this.x + this.r + 5, this.y)
  }
  run() {
    if (this.x <= this.r || this.x >= ctxW - this.r) {
      this.xSpeed = -this.xSpeed
    }
    if (this.y <= this.r || this.y >= ctxH - this.r) {
      this.ySpeed = -this.ySpeed
    }
    this.x += this.xSpeed
    this.y += this.ySpeed
  }
}

function r(num) {
  return Math.random() * num
}

function drawText(text, x, y) {
  ctx.font = '20px 楷体'
  ctx.textAlign = 'left'
  ctx.textBaseline = 'middle'
  ctx.fillText(text, x, y)
}

function drawLine(x1, y1, x2, y2, color = '#000') {
  ctx.beginPath()
  ctx.moveTo(x1, y1)
  ctx.lineTo(x2, y2)
  ctx.strokeStyle = color
  ctx.stroke()
  ctx.closePath()
}

function drawCircle(x, y, r, color = "#000") {
  ctx.beginPath()
  ctx.arc(x, y, r, 0, Math.PI * 2)
  ctx.fillStyle = color
  ctx.fill()
  ctx.closePath()
}

const ballArr = []
const textArr = 'Javascript vue react canvas css html vue3 angular H5 node nuxt'.split(' ')
for (let i = 0; i < 10; i++) {
  let ball = new Ball(textArr[i])
  ballArr.push(ball)
  ball.show()
  for (let j = 0; j < i; j++) {
    let prevBall = ballArr[j]
    drawLine(ball.x, ball.y, prevBall.x, prevBall.y, prevBall.color)
  }
}

setInterval(() => {
  ctx.clearRect(0, 0, ctxW, ctxH)
  for (let i in ballArr) {
    let ball = ballArr[i]
    ball.show()
    for (let j = 0; j < i; j++) {
      let prevBall = ballArr[j]
      drawLine(ball.x, ball.y, prevBall.x, prevBall.y, prevBall.color)
    }
  }
}, 100);