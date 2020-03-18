function render(element, parentNode) {
  if (typeof element === 'string' || typeof element === 'number') {
    return parentNode.appendChild(document.createTextNode(element))
  }
  let type, props
  type = element.type
  props = element.props
  if (type.isComponent) {
    let returnElement = new type(props).render()
    type = returnElement.type
    props = returnElement.props
  } else if (typeof type === 'function') {
    let returnElement = type(props)
    type = returnElement.type
    props = returnElement.props
  }

  let domElement = document.createElement(type)
  for (let propName in props) {
    if (propName === 'className') {
      document.className = props[propName]
    } else if (propName === 'style') {
      let styleObj = props[propName]
      for (let attr in styleObj) {
        domElement.style[attr] = styleObj[attr]
      }
    } else if (propName === 'children') {
      let children = Array.isArray(props.children) ? props.children : [props.children];
      children.forEach(child => render(child, domElement))
    } else {
      domElement.setAttribute(propName, props[propName])
    }
  }
  parentNode.appendChild(domElement)
}
export default {
  render
}