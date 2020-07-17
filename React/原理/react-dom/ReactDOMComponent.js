/**
 * 生成真实的dom
 * @param {string} type
 * @param {object} props
 * @param componentInstance
 */ 
export function createElement(type, props, componentInstance) {
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
      /*  addEvent(dom, propName, props[propName], componentInstance) */
      // ? 事件委派
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
