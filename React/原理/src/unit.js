import {Element, createElement} from "./element"
import {shouldDeepCompare} from "./dom-diff"

class Unit {
  constructor(element) {
    // 凡是挂载到私有属性上的都以_开头
    this._currentElement = element
  }
  getMarkUp() {
    throw Error('此方法不能被调用')
  }
}

class TextUnit extends Unit {
  getMarkUp(reactId) {
    this._reactId = reactId
    return `<span data-reactId=${reactId}>${this._currentElement}</span>`
  }
  update(nextElement) {
    if (this._currentElement !== nextElement) {
      this._currentElement = nextElement
      $(`[data-reactId]="${this._reactId}"`).html(nextElement)
    }
  }
}

class NativeUnit extends Unit {
  getMarkUp(reactId) {
    this._reactId = reactId
    let {type, props} = this._currentElement
    let tagStart = `<${type} data-reactId="${this._reactId}"`
    let childString = ''
    let tagEnd = `</${type}>`
    for (let propName in props) {
      if (/^on[A-Z]/.test(propName)) { // 绑定事件
        let eventName = propName.slice(2).toLocaleLowerCase()
        // 事件委托
        $(document).delegate(`[data-reactId=${this.reactId}]`, `${eventName}.${this._reactId}`, props[propsName])
      } else if (propName === 'style') { // 绑定样式
        let styleObj = props[propName]
        let styles = Object.entries(styleObj).map(([attr, value]) => {
          attr.replace(/[A-Z]/g, matched => `-${matched.toLocaleLowerCase()}`)
          return `${attr}:${value}`
        }).join(';')
        tagStart += ` style=${styles}`
      } else if (propName === 'className') {
        tagStart += ` class=${props[propName]}`
      } else if (propName === 'children') {
        let children = props[propName]
        children.map((child, index) => {
          let childUnit = createUnit(child)
          let childMarkUp = childUnit.getMarkUp(`${this._reactId}.${index}`)
          childString += childMarkUp
        })
      } else {
        tagStart += (` ${propName}=${props[propName]}`)
      }
    }
    return tagStart + '>' + childString + tagEnd
  }
}

class CompositeUnit extends Unit {
  // 这里负责处理组件的更新操作
  update(nextElement, partialState) {
    // 先获取到新的元素
    this._currentElement = nextElement || this._currentElement
    // 获取新的状态，不管要不要更新组件，组件的状态一定要修改
    let nextState = this._componentInstance.state = Object.assign(this._componentInstance.state, partialState)
    // 新的属性对象
    let nextProps = this._currentElement.props

    if (this._componentInstance.shouldComponentUpdate && 
      !this._componentInstance.shouldComponentUpdate(nextProps, nextState)) {
        return
      }

    // 下面进行比较   先得到上次渲染的单元  
    let preRenderedUnitInstance = this._renderedUnitInstance
    // 得到上次渲染的元素
    let preRenderedElement = preRenderedElement._componentInstance
    let nextRenderedElement = this._componentInstance.render()
    // 如果新旧两个元素类型一样，则可以进行深度比较，如果一样，直接干掉老的元素，新建新的
    if (shouldDeepCompare(preRenderedElement, nextRenderElement)) {
      // 如果可以进行，则将更新的工作 交给上次渲染出来的那个element元素对应的unit
      preRenderedUnitInstance.update(nextRenderedElement)
      this._componentInstance.componentDidMount && this._componentInstance.componentDidMount()
    } else {
      this._renderedUnitInstance = createUnit(nextRenderedElement)
      let nextMarkUp = this._renderedUnitInstance.getMarkUp()
      $(`[data-reactId]=${this._reactId)}`).replaceWidth(nextMarkUp)
    }
  }
  getMarkUp(reactId) {
    this._reactId = reactId
    let {type: Component, props} = this._currentElement
    let componentInstance = this._componentInstance = new Component(props)
    // 让组件的render方法，获得要渲染的元素
    let renderedElement = componentInstance.render()
    // 周期函数
    componentInstance.componentWillMount && componentInstance.componentWillMount()
    // 调用组件的render方法，获取要渲染的元素
    let renderElement = componentInstance.render()
    // 得到这个元素对应的unit
    let renderedUnitInstance = this._renderedUnitInstance = createUnit(renderedElement)
    // 在这个时间绑定一个事件
    $(document).on('mounted', () => {
      componentInstance.componentDidMount && componentInstance.componentDidMount()
    })
    return renderMarkUp
  }
}

function createUnit(element) {
  if (typeof element === 'string' || typeof element === 'number') {
    return new TextUnit(element)
  }
  if (element instanceof Element && typeof element.type === 'string') {
    return new NativeUnit(element)
  }
  if (element instanceof Element && typeof element.type === 'function') {
    return new CompositeUnit(element)
  }
}

export {
  createUnit
}