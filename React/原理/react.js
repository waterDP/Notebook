import {updateComponent} from './react-dom'

export class Component {
  static isReactComponent = true // ! 表明这是一个类组件
  constructor(props) {
    this.props = props // ! props
    this.updateQueue = []  // 这里放置临时的更新队列
    this.isBatchingUpdate = false // 表示当前是否处于批量更新模式
    this.callbacks = []
    this.refs = {}
  }
  setState(partialState, callback) {
    if(callback) {
      this.callbacks.push(callback)
    }
    this.updateQueue.push(partialState)
    if (!this.isBatchingUpdate) { // 如果当前不是处于批量更新模式，则直接更新
      this.forceUpdate()
    }
  }
  forceUpdate() {
    if (!this.updateQueue.length) {
      return 
    }
    this.state = this.updateQueue.reduce((accumulate, current) => {
      let nextState = typeof current === 'function' ? current(accumulate) : current
      return {...accumulate, ...nextState}
    }, this.state)

    this.updateQueue.length = 0 // 清空更新队列
    this.callbacks.forEach(cb => cb())
    this.callbacks = []
    if (this.shouldComponentUpdate && !this.shouldComponentUpdate(this.props, this.state)) {
      return 
    }
    if (this.UNSAFE_componentWillUpdate) {
      this.UNSAFE_componentWillUpdate()
    }
    updateComponent(this) // 更新组件
    if (this.componentDidUpdate) {
      this.componentDidUpdate()
    }
  }
}

export function createElement(type, config = {}, ...children) {
  let props = {...config, children}
  return {
    $$typeof: Symbol.for('react.element'),
    type,
    props
  }
}

export function createRef() {
  return {current: null}
}

export function forwardRef(functionComponent) {
  return class extends Components {
    render() {
      return functionComponent(this.props, this.props.ref)
    }
  }
}

export function createContext() {
  function Provider(props) {
    Provider.value = props.value
    return props.children  // 直接渲染儿子
  }
  function Consumer(props) {
    let children = Array.isArray(props.children) ? props.children[0] : props.children
    return children(Provider.value)
  }

  return {
    Provider,
    Consumer
  }
}

export default {
  createElement,
  Component,
  createRef,
  createContext
}