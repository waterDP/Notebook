import {createDOM} from '../react-dom'

export class Component {
  constructor(props) {
    this.props = props
    this.updateQueue = [] // 缓存更新队列
    this.isBatchingUpdate = false // 如果false，表示会立刻更新 
  }
}

Component.prototype.isReactComponent = {}

Component.prototype.setState = (partialState) => {
  this.updateQueue.push(partialState)
  // 如果是指更新，则什么都不做。如果是非批量更新
  !this.isBatchingUpdate && this.flushUpdateQueue()
}

Component.prototype.flushUpdateQueue = () => {
  while (this.updateQueue.length) {
    let item = this.updateQueue.shift()
    if (typeof item === 'function') {
      this.state = {...this.state, ...item(this.state)}
    } else {
      this.state = {...this.state, ...item}
    }
  }
  // 用新状态去得到新的render结果react元素，然后通过react元素生成新的dom节点，替换掉老的dom
  renderComponent(this)
}

function renderComponent(componentInstance) {
  if (componentInstance.shouldComponentUpdate && !componentInstance.shouldComponentUpdate()) {
    return  // 如果有shouldComponentUpdate函数并且返回值为 false的话，就什么都不做
  }
  // 将要更新
  let renderElement = componentInstance.render()
  // 得到新的DOM元素
  let newDOM = createDOM(renderElement)
  // 用新生成的DOM节点替换掉老的DOM节点
  componentInstance.dom.parentNode.replaceChild(newDOM, componentInstance.dom)
  // ! 组件更新完成 周期函数componentDidUpdate
  componentInstance.componentDidUpdate && componentInstance.componentDidUpdate()
  componentInstance.dom = newDOM
}