import {updateComponent} from './react-dom'

export class Component {
  static isReactComponent = true
  constructor(props) {
    this.props = props
    this.updateQueue = []  // 这里放置临时的更新队列
    this.isBatchingUpdate = false // 表示当前是否处于批量更新模式
  }
  setState(partialState) {
    this.updateQueue.push(partialState)
    if (!this.isBatchingUpdate) { // 如果当前不是处于批量更新模式，则直接更新
      this.forceUpdate()
    }
  }
  forceUpdate() {
    this.state = this.updateQueue.reduce((accumulate, current) => {
      let nextState = typeof current === 'function' ? current(accumulate) : current
      return {...accumulate, ...nextState}
    }, this.state)

    this.updateQueue.length = 0 // 清空更新队列
    updateComponent(this) // 更新组件
  }
}

export function createElement(type, config = {}, ...children) {
  let props = {...config, children}
  return {
    type,
    props
  }
}

export default {
  createElement,
  Component,
}