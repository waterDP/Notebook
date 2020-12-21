import {render} from './render'

export function createDOM(type, props, componentInstance) {
  let currentDOM = document.createElement(type)
  
  for (let propName in props) {
    if (propName === 'children') {
      let children = props.children
      children.forEach(child => render(child, currentDOM, componentInstance))
    } else if (propName === 'style') {
      let styObj = props.style
      for (let attr in styObj) {
        currentDOM.style[attr] = styObj[attr]
      }
    } else if (propName === 'className') {
      currentDOM.className = props.className
    } else if (propName.slice(0, 2) === 'on') {
      // todo 事件处理
    } else {
      currentDOM.setAttribute(propName, props[propName])
    }
  }
  return currentDom
}