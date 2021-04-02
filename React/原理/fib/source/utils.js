/*
 * @Description: 
 * @Date: 2021-02-19 11:01:17
 * @Author: water.li
 */
export function setProps(dom, oldProps, newProps) {
  for (let key in oldProps) {
    if (key !== 'children') {
      if (newProps.hasOwnProperty(key)) {
        setProp(dom, key, newProps[key])
      } else {
        dom.removeAttribute(key)
      }
    }
  }
  for (let key in newProps) {
    if (key !== 'children') {
      if (!oldProps.hasOwnProperty(key)) {
        setProp(dom, key, newProps[key])
      }
    }
  }
}

function setProp(dom, key, value) {
  if (/^on/.test(key)) { // onClick
    dom[key.toLowerCase()] = value
  } else if (key === 'style') {
    if (value) {
      for (let styleName of value) {
        dom.style[styleName] = value[styleName]
      }
    }
  } else {
    dom.setAttribute(key, value)
  }
}