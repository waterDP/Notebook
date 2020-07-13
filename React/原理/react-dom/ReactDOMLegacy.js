import {createElement} from './ReactDOMComponent'
/**
 * @param {object} element
 * @param {object} container
 * @param {function} componentInstance
 */
export function render(element, container, componentInstance) {
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
  } else if (typeof type === 'function') { // ? 说明是一个函数组件
    element = type(props) // 函数组件执行后会返回一个React函数
    element = Array.isArray(element) ? element[0] : element
    type = element.type
    props = element.props
  }
  // 如果说类组件的实例，渲染出来的实例也是一个类组件
  if (typeof type === 'function') {
    return render(element, container, componentInstance)
  }

  let dom = createElement(type, props)
  if (componentInstance) {
    // 如果当前渲染的是一个类组件，我们就让这个组件的实例的dom指向这个类组件创建出来的真实DOM
    componentInstance.dom = dom
  }
  container.appendChild(dom)
  if (isReactComponent && componentInstance && componentInstance.componentDidMount) {
    componentInstance.componentDidMount()
  }
}