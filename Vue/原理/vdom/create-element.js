export function createElement(tag, data={}, ...children) {
  let key = data.key
  delete data.key
  return vnode(tag, data, key, children, undefined)
}

export function createTextNode(text) {
  return vnode(undefined, undefined, undefined, undefined, text)
}

function vnode(tag, data, key, children, text) {
  return {
    tag,
    data,
    key,
    children,
    text
  }
}