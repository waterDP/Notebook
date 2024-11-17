/*
 * @Author: water.li
 * @Date: 2024-11-17 21:21:33
 * @Description: 
 * @FilePath: \Notebook\Canvas\demo\index.js
 */
const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')


function init() {
  canvas.width = window.innerWidth * devicePixelRatio
  canvas.height = window.innerHeight * devicePixelRatio

}
init()

function getRandom(min, max) {
  return Math.floor(Math.random() * (max + 1 - min) + min)
}

class Point {
  constructor() {
    this.r = 6
    this.x = getRandom(0, canvas.width - this.r / 2)
    this.y = getRandom(0, canvas.height - this.r / 2)
    this.xSpeed = getRandom(-50, 50)
    this.ySpeed = getRandom(-50, 50)
    this.lastDrawTime = null
  }
  draw() {
    // 更新坐标
    if (this.lastDrawTime) {
      // 计算新的坐标
      const duration = (Date.now() - this.lastDrawTime) / 1000
      const xDis = this.xSpeed * duration
      const yDis = this.ySpeed * duration
      let x = this.x + xDis
      let y = this.y + yDis
      if (x > canvas.width - this.r / 2) {
        x = canvas.width - this.r / 2 
        this.xSpeed = -this.xSpeed
      } else if (x < 0) {
        x = 0
        this.xSpeed = -this.xSpeed
      }
      if (y > canvas.height - this.r / 2) {
        y = canvas.height - this.r / 2
        this.ySpeed = -this.ySpeed
      } else if (y < 0) {
        y = 0
        this.ySpeed = -this.ySpeed
      }
      this.x = x
      this.y = y
    }
    ctx.beginPath()
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2)
    ctx.fillStyle = 'rgb(200, 200, 200)'
    ctx.fill()
    this.lastDrawTime = Date.now()

  }
}

class Graph {
  constructor(pointerNumber = 30, maxDis = 500) {
    this.points = new Array(pointerNumber).fill(0).map(() => new Point)
    this.maxDis = maxDis
  }
  draw() {
    requestAnimationFrame(() => {
      this.draw()
    })
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    for (let i = 0; i < this.points.length; i++) {
      const p1 = this.points[i]
      p1.draw()
      for (let j = i + 1; j < this.points.length; j++) {
        const p2 = this.points[j]
        const d = Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2))
        if (d > this.maxDis) continue
        ctx.beginPath()
        ctx.moveTo(p1.x, p1.y)
        ctx.lineTo(p2.x, p2.y)
        ctx.strokeStyle = `rgb(200, 200, 200, ${1 - d / this.maxDis})`
        ctx.stroke()
      }
    }
  }
}
const g = new Graph()
g.draw()





