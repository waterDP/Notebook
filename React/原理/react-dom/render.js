import { createDOM } from './createDOM'

export function render(element, parent, componentInstance) {
  if (typeof element === 'string' || typeof element === 'number') {
    return parent.appendChild(document.createTextNode(element))
  }
  
  let type = element.type, props = element.props
  let isReactComponent = !!type.prototype.isReactComponent  // 表示是否是React Class 组件
  if (isReactComponent) {
    componentInstance = new type(props)  // 设置props state
    componentInstance.componentWillMount && componentInstance.componentWillMount()  // ! 组件将要挂载  
    element = componentInstance.render() // ! 调用render方法，得到一个元素 
    type = element.type
    props = element.props
  } else if (typeof type === 'function') {
    element = type(props)
    type = element.type
    props = element.props
  } 
  // 把React元素转换成真实的DOM元素
  // ! 这里的element就是一个vdom
  let dom = createDOM(element)
   
  if (isReactComponent) { // 如果当前渲染的是一个类组件的话，让类组件的dom属性指向这个类组件渲染出来的真实DOM节点
    componentInstance.dom = dom
  }
  parent.appendChild(dom) // ! 当把此虚拟DOM节点转成真实DOM节点并且添加到父节点中去之后，挂载完成了
  isReactComponent && componentInstance.componentDidMount && componentInstance.componentDidMount()
}