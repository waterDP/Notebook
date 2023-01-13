/*
 * @Author: water.li
 * @Date: 2023-01-03 21:56:26
 * @Description: 
 * @FilePath: \Notebook\React\源码\react\src\jsx\ReactJSXElement.js
 */

import hasOwnProperty from "../../../shared/hasOwnProperty"
import { REACT_ELEMENT_TYPE } from "../../../shared/ReactSymbols"


const RESERVED_PROPS = {
  key: true,
  ref: true,
  __self: true,
  __source: true
}

function hasValidKey(config) {
  return config.key !== undefined
}

function hasValidRef(config) {
  return config.ref !== undefined
}

function ReactElement(type, key, ref, props) {
  return { // 这就是React无素，也就是虚拟dom
    $$typeof: REACT_ELEMENT_TYPE,
    type,
    key,
    ref, 
    props
  }
}

export function jsxDEV(type, config) {
  let propName // 属性名
  const props = {}
  let key = null // 每个虚拟Dom可以有一个可选的key属性，用来区分一个父节点下的不同子节点
  let ref = null // 引入，后面可能通过这实现获取直接的DOM的需求
  if (hasValidKey(config)) {
    key = config.key
  }
  if (hasValidRef(config)) {
    ref = config.ref
  }
  for (propName in config) {
    if (hasOwnProperty.call(config, propName) 
      && !RESERVED_PROPS.hasOwnProperty(propName)) {
      props[propName] = config[propName]
    }
  }
  return ReactElement(type, key, ref, props)
}