// 合成事件
class SyntheticEvent {
  constructor() {
    this.events = {}
    this.syntheticEvent = {}
  }
  on = (type, dom, handler, componentInstance) => {
    let listeners = this.events
    if (listeners) {
      this.listeners.push({dom, handler, componentInstance})
    } else {
      this.events[type] = [{dom, handler, componentInstance}]
    }
  }
  trigger= (type, event) => {
    let listeners = this.events[type]
    listeners.forEach(item => {
      if (item.dom === event.target) {
        // 在事件处理函数执行之前把isBatchingUpdate = true
        item.componentInstance && (item.componentInstance.isBatchingUpdate = true)
        this.syntheticEvent.target = event.target
        this.syntheticEvent.clientX = event.clientX
        this.syntheticEvent.clientY = event.clientY

        item.handler(this.syntheticEvent)


        // 在事件处理函数执行之后把isBatchingUpdate = false
        this.syntheticEvent = {}
        item.componentInstance && 
          (item.componentInstance.isBatchingUpdate = false, this.componentInstance.flushUpdateQueue())
      }
    })
  }
}

export default SyntheticEvent