/*
 * @Description: 
 * @Date: 2021-02-19 11:01:17
 * @Author: water.li
 */
export function setProps(dom, oldProps, newProps) {
  for (let key in oldProps) {

  }
  for (let key in newProps) {
    if (key !== 'children') {
      setProp(dom, key, newProps[key])
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