export function patch(oldVnode, vnode) {
  // 递归创建真实节点，替换掉老的节点
  // 1.判断是更新还还是要渲染

  if (!oldVnode) {
    // 组件的挂载

    return createElm(vnode)
  }
  const isRealElement = oldVnode.nodeType
  if (isRealElement) {
    const oldElm = oldVnode
    const parentElm = oldVnode.parentNode
    let el = createElm(vnode)
    parentElm.insertBefore(el, oldElm.nextSibling)
    parentElm.removeChildren(oldElm)

    return el
  }

}

function createComponent(vnode) {
  // 需要创建的组件的实例
  let i = vnode.data
  if ((i = i.hook) && (i = i.init)) {
    i(vnode)
  }
  if (vnode.componentInstance) {
    return true
  }
}
/**
 * 模拟虚拟节点，创建真实的节点
 */
function createElm(vnode) {
  const { tag, children, key, data, text } = vnode
  if (typeof tag === 'string') {
    // 是标签就创建标签
    // 实例化组件
    if (createComponent(vnode)) {
      // 这里应该返回的是真实的dom
      return vnode.instance.$el
    }
    vnode.el = document.createElement(tag)
    updateProperties(vnode)
    children.forEach(child => { // 递归创建儿子节点，将儿子节点放到父节点中
      vnode.el.appendChild(createElm(child))
    })
  } else {
    // 文本节点
    // 虚拟dom上映射着真实的dom 方便后续更新操作
    vnode.el = document.createTextNode(text)
  }
  return vnode.el
}

/**
 * 更新属性 
 */
function updateProperties(vnode) {
  let newProps = vnode.data
  let el = vnode.el

  for (let key in newProps) {
    if (key === 'style') {
      for (let styleName in newProps.style) {
        el.style[styleName] = newProps.style[styleName]
      }
    } else if (key === 'class') {
      el.className = newProps.class
    } else {
      el.setAttribute(key, newProps[key])
    }
  }
}