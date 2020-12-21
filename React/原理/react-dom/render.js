import { createDOM } from './createDOM'
export function render(element, parent, componentInstance) {
  if (typeof element === 'string' || typeof element === 'number') {
    return parent.appendChild(document.createTextNode(element))
  }
  
  let type = element.type, props = element.props
  let isReactComponent = !!type.prototype.isReactComponent
  if (isReactComponent) {
    componentInstance = new type(props)
    element = componentInstance.render()
    type = element.type
    props = element.props
  } else if (typeof type === 'function') {
    element = type(props)
    type = element.type
    props = element.props
  } 

  let dom = createDOM(type, props, componentInstance)
  if (isReactComponent) { // 如果当前渲染的是一个类组件的话，让类组件的dom属性指向这个类组件渲染出来的真实DOM节点
    componentInstance.dom = dom
  }
  parent.appendChild(dom)
}