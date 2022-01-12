/*
 * @Author: water.li
 * @Date: 2022-01-12 22:02:16
 * @Description: 
 * @FilePath: \notebook\JavaScript\async-queue.js
 */
class AsyncQueue {
  constructor() {
    // 任务队列列
    this.queue = []
    // 当前是否有任务执行
    this.running = false
  }
  push(fun) {
    return new Promise((resolve, reject) => {
      // 将传入的fun包装一层，并添加进任务队列中
      this.queue.push(async () => {
        this.running = true
        try {
          const res = await fun()
          resolve(res)
        } catch (e) {
          reject(e)
        }
        this.running = false

        // 上一个任务执行完成后，取出队列中的第一个任务执行
        // ?. 为可选链操作符，如果前面没有元素，则不会执行后面的方法
        this.queue.shift()?.()
      })

      // 当前是否有任务在执行，没有则取出任务中的第一个任务执行
      if (!this.running) {
        this.queue.shift()?.()
      }
    })
  }
}