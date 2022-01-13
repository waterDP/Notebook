/*
 * @Author: water.li
 * @Date: 2022-01-13 16:27:21
 * @Description: 并行limit个promise任务
 * @FilePath: \notebook\JavaScript\async-Schedule.js
 */
class Scheduler {
  constructor(limit) {
    this.queue = []
    this.limit = limit || 2
    this.running = 0
  }
  add(promiseCreator) {
    this.queue.push(promiseCreator)
    this.runQueue()
  }
  runQueue() {
    if (this.queue.length && this.running < this.limit) {
      const promiseCreator = this.queue.shift()
      this.running++
      promiseCreator().then(() => {
        this.running--
        // 尝试进行下一次任务
        this.runQueue()
      })
    }
  }
}