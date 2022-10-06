export function patch(oldVnode, vnode) {
  // 递归创建真实节点，替换掉老的节点
  // 1.判断是更新还还是要渲染

  if (!oldVnode) {
    // 组件的挂载
    return createElm(vnode)
  }
  const isRealElement = oldVnode.nodeType
  if (isRealElement) { // 真实元素
    const oldElm = oldVnode
    const parentElm = oldVnode.parentNode
    let el = createElm(vnode)
    parentElm.insertBefore(el, oldElm.nextSibling)
    parentElm.removeChildren(oldElm)

    return el
  }

  // 虚拟dom 比对两个虚拟节点
  // 1.标签不一致 直接替换结果
  if (oldVnode.tag !== vnode.tag) {
    oldVnode.el.parentNode.replaceChild(createElm(vnode), oldVnode.el)
  }

  // 2.如果文本不一样呢？ 文本都没有tag
  if (!oldVnode.tag) {
    if (oldVnode.text !== vnode.text) {
      oldVnode.el.textContent = vnode.text
    }
  }

  // 3.标签一致且不是文本了（比对属性是否一致）
  let el = vnode.el = oldVnode.el
  updateProperties(vnode, oldVnode.data)

  // 比对儿子
  let oldChildren = oldVnode.children || []
  let newChildren = vnode.children || []

  if (oldChildren.length && newChildren.length) {
    // 需要比对里面的儿子
    // ! diff
    updateChildren(el, oldChildren, newChildren)
  } else if (newChildren.length) {
    // 新的有孩子，老的没孩子，直接将孩子的霸气节点转化成真实的节点，插入即可
    for (let i = 0; i < newChildren.length; i++) {
      let child = newChildren[i]
      el.appendChild(createElm(child))
    }
  } else if (oldChildren.length) {
    // 老的有孩子，新的没孩子
    el.innerHTML = ''
  }
}

function isSameVnode(oldVnode, newVnode) {
  return (oldVnode.tag === newVnode.tag) && (oldVnode.key === newVnode.key)
}

/**
 * ! diff 算法
 * @param {HTMLElement} parent
 * @param {array<vnode>} oldChildren
 * @param {array<vnode>} newChildren
 */
function updateChildren(parent, oldChildren, newChildren) {
  // vue采用的双指针的方式
  let oldStartIndex = 0
  let newStartIndex = 0
  let oldEndIndex = oldChildren.length - 1
  let newEndIndex = newChildren.length - 1

  let oldStartVnode = oldChildren[0]
  let newStartVnode = newChildren[0]
  let oldEndVnode = oldChildren[oldEndIndex]
  let newEndVnode = newChildren[newEndIndex]

  const makeIndexByKey = (children) => {
    const map = {}
    children.forEach((item, index) => {
      item[key] && (map[item.key] = index) // 根据key创建一个映射表
    })
    return map
  }
  let map = makeIndexByKey(oldChildren)

  // 在比对过程中 新老虚拟节点有一方循环完毕就结束
  while(oldStartIndex <= oldEndIndex && newStartIndex <= newEndIndex) {
    if (!oldStartVnode) {
      oldStartVnode = oldChildren[++oldStartIndex]
    } else if (!oldEndVnode) {
      oldEndVnode = oldEndVnode[--oldEndIndex]
    } else if (isSameVnode(oldStartNode, newStartNode)) { // todo 1.优化后向插入的情况 abc -> abcd
      // 如果是同一个节点，就需要比对这个元素的属性
      patch(oldStartVnode, newStartVnode) // 比对开头节点
      oldStartVnode = oldChildren[++oldStartIndex]
      newStartVnode = newChildren[++newStartIndex]
    } else if (isSameVnode(oldEndVnode, newEndVnode)) { // todo 2.优化向前插入的情况 abc -> eabc
      patch(oldEndVnode, newEndVnode) 
      oldEndVnode = oldChildren[--oldEndIndex]
      newEndVnode = newChildren[--newEndIndex]
    } else if (isSameVnode(oldStartVnode, newEndVnode)) { // todo 3.头移尾 abcd -> dabc 这里也涉及到倒序变正序
      patch(oldStartVnode, newEndVnode)
      parent.insertBefore(oldStartVnode.el, oldEndVnode.el.nextSibling)
      oldStartVnode = oldChildren[++oldStartIndex]
      newEndVnode = newChildren[--newEndIndex]
    } else if (isSameVnode(oldEndVnode, newStartVnode)) { // todo 4.尾移头
      patch(oldEndVnode, newStartVnode)
      parent.insertBefore(oldEndVnode.el, oldStartVnode.el)
      oldEndVnode = oldChildren[--oldEndIndex]
      newStartVnode = newChildren[++newStartIndex]
    } else { // todo 5.暴力比对 乱序
      // 根据老节点的key做一个映射表 拿新虚拟节点去映射表中查找
      // 如果可以查找到，则进行移动操作 即移动到头指针前面的位置
      // 如果找不能直接将元素插入即可
      let moveIndex = map[newStartVnode.key]
      if (!typeof moveIndex === 'number') { // 没有 直接插入
        parent.insertBefore(createElm(newStartVnode), oldStartVnode.el)
      } else { // 如果在映射表中查找到了，则直接将元素移走，并且将当前位置置为空
        let moveVnode = oldChildren[moveIndex]
        oldChildren[moveIndex] = undefined
        parent.insertBefore(moveVnode.el, oldStartVnode.el)
        patch(moveVnode, moveVnode)
      }
      newStartVnode = newChildren[++newStartIndex]
    }
  }

  if (newStartIndex <= newEndIndex) {
    for (let i = newStartIndex; i <= newEndIndex; i++) {
      // 将新增的元素直接加入(可能是向后插入，也有可能是向前插入的) insertBefore
      let flag = newChildren[newEndIndex+1]
      if (!!flag) { // 向后插入
        parent.insertBefore(createElm(newChildren[i]), null) // 写null就等价于 appendChild
      } else {
        parent.insertBefore(createElm(newChildren[i]), flag.el)
      }
    }
  }

  if (oldStartIndex < oldEndIndex) { // 新的列表少了元素，应该把老的删除了
    for (let i = oldStartIndex; i <= oldEndIndex; i++) {
      let child = oldChildren[i]
      child && parent.removeChild(child.el)
    }
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
 * 虚拟节点=>创建真实的节点
 * @param vnode
 * @return {HTMLElement}
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
function updateProperties(vnode, oldProps = {}) {
  let newProps = vnode.data || {}
  let el = vnode.el

  let newStyle = newProps.style || {}
  let oldStyle = oldProps.style || {}
  for(let key in oldStyle) {
    if (!newStyle[key]) {
      el.style[key] = ''
    }
  }

  // 如果老的属性中 新的属性中没有， 在真实的dom上将这个属性删除掉
  for (let key in oldProps) {
    if (!newProps[key]) {
      el.removeAttribute(key)
    }
  }

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