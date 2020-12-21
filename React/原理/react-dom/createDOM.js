import {render} from './render'
import SyntheticEvent from './SyntheticEvent'

// 合成事件
let syntheticEvent = new SyntheticEvent

document.addEventListener('click', event => syntheticEvent.trigger.bind('onclick', event))
document.addEventListener('dblclick', event => syntheticEvent.trigger.bind('ondblclick', event))
// ...

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
      syntheticEvent.on(propName.toLocaleLowerCase, currentDOM, props[[propName], componentInstance])
    } else {
      currentDOM.setAttribute(propName, props[propName])
    }
  }
  return currentDom
}