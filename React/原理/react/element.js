export function createElement(type, config, ...children) {
  let props = {
    ...config,
    children
  }
  let element = {
    type,
    props
  }
  return element
} 