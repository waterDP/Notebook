function updateComponent(componentInstance) {
  let element = componentInstance.render()
  let {type, props} = element
  if (typeof type === 'function') {
    if (isReactComponent) { // 类组件
      componentInstance = new type(props)
      if (componentInstance.componentWillMount) {
        componentInstance.componentWillMount()
      }
      let element = componentInstance.render()
      element = Array.isArray(element) ? element[0] : element
      type = element.type
      props = element.props
    } else if (typeof type === 'function') { // 说明是一个函数组件
      element = type(props) // 函数组件执行后会返回一个React函数
      element = Array.isArray(element) ? element[0] : element
      type = element.type
      props = element.props
    }
  }
  let newDOM = createDOM(type, props, componentInstance)
  // 把老的dom节点替换成新的DOM节点
  componentInstance.dom.parentNode.replaceChild(newDOM, componentInstance.dom)
  componentInstance.dom = newDOM
}

/**
 * @param element {type, props}
 * @param {HtmlElement} container
 */
function render(element, container, componentInstance) {
  if (typeof element === 'string' || typeof element === 'number') {
    return container.appendChild(document.createTextNode(element))
  }

  let {type, props} = element
  let isReactComponent = type.isReactComponent

  if (isReactComponent) { // 类组件
    componentInstance = new type(props)
    if (props.ref) {
      props.ref.current = componentInstance
    }
    if (componentInstance.componentWillMount) {
      componentInstance.componentWillMount()
    }
    let element = componentInstance.render()
    element = Array.isArray(element) ? element[0] : element
    type = element.type
    props = element.props
  } else if (typeof type === 'function') { // 说明是一个函数组件
    element = type(props) // 函数组件执行后会返回一个React函数
    element = Array.isArray(element) ? element[0] : element
    type = element.type
    props = element.props
  }
  // 如果说类组件的实例，渲染出来的实例也是一个类组件
  if (typeof type === 'function') {
    return render(element, container, componentInstance)
  }

  let dom = createDOM(type, props)
  if (componentInstance) {
    // 如果当前渲染的是一个类组件，我们就让这个组件的实例的dom指向这个类组件创建出来的真实DOM
    componentInstance.dom = dom
  }
  container.appendChild(dom)
  if (isReactComponent && componentInstance && componentInstance.componentDidMount) {
    componentInstance.componentDidMount()
  }
}

/** 
 * 合成事件
 * 在事件处理函数执行前要把批量更新模式设置为true
 * 这样的话在函数执行过程中就不会直接更新界面和状态了，只会缓存状态到updateQueue里
 * 等事件处理函数结束后才会进行实际的更新
 * 事件委托，把所有的事件监听都委托给document
 */

function addEvent(dom, eventType, listener, componentInstance) {
  eventType = eventType.toLowerCase()
  let eventStore = dom.eventStore || (dom.eventStore = {})
  eventStore[eventType] = {listener, componentInstance}
  document.addEventListener(eventType.slice(2), dispatchEvent, false)
}

function dispatchEvent(event) { // event是原生的DOM事件
  let {type, target} = event
  while(target) {
    let {eventStore} = target
    if (eventStore) {
      let {listener, componentInstance} = eventStore['on'+type] 
      if (listener) {
        if (componentInstance) {
          componentInstance.isBatchingUpdate = true
        }
        listener.call(null, event)
        if (componentInstance) {
          componentInstance.isBatchingUpdate = false
          componentInstance.forceUpdate()
        }
      }
    }
    target = target.parentNode
  }
}

function createDOM(type, props, componentInstance) {
  let dom = document.createElement(type)
  for (let propName in props) {
    if (propName === 'children') {
      props.children.forEach(child => render(child, dom, componentInstance))
    } else if (propName === 'className') {
      dom.className = props[propName]
    } else if (propName === 'style') {
      let styleObj = props[propName]
      for (let attr in styleObj) {
        dom.style[attr] = styleObj[attr]
      }
    } else if (propName.startsWith('on')) {
      addEvent(dom, propName, props[propName], componentInstance)
    } else {
      dom.setAttribute(propName, props[propName])
    }
  }

  // todo ref
  if (prop && props.ref) {
    if (typeof props.ref === 'string') {
      this.refs[props.ref] = dom
    } else if (typeof props.ref === 'function') {
      props.ref.call(componentInstance, dom)
    } else if (typeof props.ref === 'object') {
      props.ref.current = dom
    }
  }

  return dom
}

export default {
  render,
  updateComponent
}