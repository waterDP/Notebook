/*
 * @Author: water.li
 * @Date: 2021-11-29 14:23:15
 * @Description: 面向对象  碰撞检测
 * @FilePath: \notebook\Canvas\随机运动的小球.js
 */
let canvas = document.getElementById('canvas')
let ctx = canvas.getContext('2d')

const ctxW = 500
const ctxH = 500

function r(num) {
  return Math.random() * num
}

class Ball {
  constructor() {
    this.x = r(2)+60
    this.y = r(3)+60
    this.r = r(50) + 10
    this.color = '#' + parseInt(Math.random()*0xffffff).toString(16)
    this.xSpeed = r(10) + 4
    this.ySpeed = r(10) + 1
    this.show()
  }
  show() {
    ctx.beginPath()
    ctx.arc(this.x, this.y, this.r, 0, Math.PI*2)
    ctx.fillStyle = this.color
    ctx.fill()
    ctx.closePath()
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
    this.show()
  }
}

const barArr = []
for (let i = 0; i < 5; i++) {
  const ball = new Ball()
  barArr.push(ball)
}

setInterval(() => {
  ctx.clearRect(0, 0, ctxW, ctxH)
  for (let ball of barArr) { 
    ball.run()
  }
}, 50);
