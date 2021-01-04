import { ELEMENT, TEXT } from '../shared/constants'
import SyntheticEvent from './SyntheticEvent'
import {onlyOne} from '../shared/utils'

// 合成事件
let syntheticEvent = new SyntheticEvent
 
document.addEventListener('click', event => syntheticEvent.trigger.bind('onclick', event))
document.addEventListener('dblclick', event => syntheticEvent.trigger.bind('ondblclick', event))
// ...

function createNativeDOM(element) {
  let {type, props} = element
  let dom = document.createElement(type) 
  // ! 创建此元素的子节点
  createNativeChildren(dom, element.props.children)
  // ! 给此元素添加属性 
  setProps(dom, props)
}

function createNativeChildren(parentNode, children) {
  children && children.flat(Infinity).forEach(child => {
    let childDOM = createDOM(child) // 创建子虚拟节DOM节点的真实DOM元素
    parentNode.appendChild(childDOM)
  }) 
}

function setProps(dom, props) {
  for (let propName in props) {
    if (propName !== 'children') {
      if (propName === 'style') {  // todo 样式
        let styObj = props.style
        for (let styleName in styObj) {
          currentDOM.style[styleName] = styObj[styleName]
        }
      } else if (propName === 'className') { // todo class 属性
        currentDOM.className = props.className
      } else if (propName.slice(0, 2) === 'on') {  // todo 合成事件
        syntheticEvent.on(propName.toLocaleLowerCase, dom, props[[propName], componentInstance])
      } else {  // todo 其它普通的属性
        dom.setAttribute(propName, props[propName])
      }
    }
  }
}

export function createDOM(element) {
  element = onlyOne(element)
  let {$$typeof, ref} = element
  let dom = null
  if (!$$typeof) {
    dom = document.createTextNode(element) 
  } else if ($$typeof === TEXT) {
    dom = document.createTextNode(element.content)
  } else if ($$typeof === ELEMENT) {
    dom = createNativeDOM(element)
  } 
  ref && (ref.current = dom)  // todo 处理ref属性
  return dom
}