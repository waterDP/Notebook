function ReactElement(type, props) {
  const element = {type, props}
  return element;
}

function createElement(type, config, children) {
  let propName;
  const props = {}
  for (propName in config) {
    props[propName] = config[propName]
  }
  const childrenLength = arguments.length - 2;
  if (childrenLength === 1) {
    props.children = children
  } else {
    props.children = Array.from(arguments).slice(2)  // 去掉前两个
  }
  return ReactElement(type, props)
}

function createRef() {
  return {
    current: null
  }
}

class Component {
  static isReactComponent = true
  constructor(props) {
    this.props = props
  }
}

export default {
  createElement,
  createRef,
  Component
}