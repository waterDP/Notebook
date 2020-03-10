// 这个文件除了第一次的初始化渲染之外
/**
 * @param {object} vnode
 * @param {HtmlElement} container
 * @return {HtmlElement}
 */
export function render(vnode, container) {
  let el = createElm(vnode)
  container.appendChild(el)
  return el
}

// 还要做比对操作

/**
 * 创建真实的节点
 * @param {vnode} vnode
 * @return {HtmlElement}
 */
function createElm(vnode) {
  let {tag, children, key, props, text} = vnode
  if (typeof tag === 'string') {
    // 标签 一个虚拟节点 对应着他的真实节点
    vnode.el = document.createElement(tag)
    updatePropertices(vnode)
    children.forEach(child => {
      return render(child, vnode.el)
    })
  } else {
    // 文本
    vnode.el = document.createTextNode(text)
  }
}

// 第一次没有oldProps
/**
 * 更新属性
 * @param {vnode} vnode 
 * @param {object} oldProps 
 */
function updatePropertices(vnode, oldProps = {}) {
  let newProps = vnode.props
  let el = vnode.el
  let newStyle = newProps.style || {}
  let oldStyle = oldProps.style || {}

  // 稍后会用到这个更新操作 主要的作用就是 根据新的虚拟节点 来修改dom元素
  for (let key in oldStyle) {
    let (!newStyle[key]) {
      newStyle[key] = ''
    }
  }
  // 如果下次更新时 应该用新的属性 来更新老的节点
  // 如果老的中有属性  新的上面没有
  for (let key in oldProps) {
    if (!newProps[key]) {
      delete el[key] // 如果新的没有这个属性了，那就直接删除掉dom上的这个属性
    }
  }

  // 我要先考虑一下  以前有没有
  for (let key in newProps) {
    if (key === 'style') {
      for(let styleName in newProps.style) {
        el.style[styleName] = newProps.style[styleName]
      }
    } else if (key === 'class') {
      el.className = newProps.class
    } else {
      el[key] = newProps[key]
    }
  }
}

/**
 * @param {vnode} oldVnode
 * @param {vnode} newVnode
 * @return {HtmlElement}
 */
export function patch(oldVnode, newVnode) {
  // 1. 比对标签是不是一样 直接替换
  if (oldVnode.tag !== newVnode.tag) {
    oldVnode.el.parentNode.replaceChild(createElm(newVnode), oldVnode.el)
  }

  // 2. 比较文本
  if (!oldVnode.tag) {
    if (oldVnode.text !== newVnode.text) { // 如内容否不一致，直接用当前的新的元素中的内容来替换
      oldVnode.el.textContent = newVnode.text
    }
  }

  // 标签一样，可能属性不一样
  let el = newVnode.el = oldVnode.el  // 标签一样  利用即可
  updatePropertices(newVnode, oldVnode.props)

  // 比较孩子
  let oldChildren = oldVnode.children || []
  let newChildren = newVnode.children || []

  if (oldChildren.length > 0 && newChildren.length > 0) { // 老的有孩子  新的有孩子
    updateChildren(el, oldChildren, newChildren)
  } else if (oldChildren.length > 0) { // 老的有孩子  新的没孩子
    el.innerHTML = '' // 清空
  } else if (newChildren.length > 0) { // 老的没孩子  新的有孩子 把新的插入老的
    for (let i = 0; i < newChildren.length; i++) {
      let child = newChildren[i]
      el.appendChild(createElm(child))  // 将当前新的孩子 丢到老的节点中即可
    }
  } 
  return el
}

/** 
 * 比较两个虚拟节点是否一样 
 * 如果两个节点的标签和key一样，我认为他们是同一个节点
 * @param {vnode} oldVnode
 * @param {vnode} newVnode
 * @return {booldean}
 */ 
function isSameVnode(oldVnode, newVnode) {
  return (oldVnode.tag === newVnode.tag) && (oldVnode.key === newVnode.key)
}

/**
 * 更新子节点
 * @param {HtmlElement} parent
 * @param {vnode} oldChildren
 * @param {vnode} newChildren
 */
function updateChildren(parent, oldChildren, newChildren) {
  let oldStartIndex = 0
  let oldStartVnode = oldChildren[0]
  let oldEndIndex = oldChildren.length
  let oldEndVnode = oldChildren[oldEndIndex]

  let newStartIndex = 0
  let newStartVnode = newChildren[0]
  let newEndIndex = newChildren.length
  let newEndVnode = newChildren[newEndIndex]

  function makeIndexByKey(children) {
    let map = {}
    chilren.forEach((item, index) => {
      map[item.key] = index;
    })
    return map;
  }

  const map = makeIndexByKey(oldChildren);

  while(oldStartIndex <= oldEndIndex && newStartIndex <= newEndIndex) {
    if (!oldStartVnode) {
      oldStartVnode = oldChildren[++oldStartIndex]
    } else if (!oldEndVnode) {
      oldEndVnode = oldChildren[--oldEndIndex]
    }
    // 向后插入元素 abcd -> abcde
    else if (isSameVnode(oldStartVnode, newStartIndex)) { // 先看前面是否一样
      patch(oldStartVnode, newStartVnode) // 用新的属性来更新老的属性
      oldStartVnode = oldChildren[++oldStartIndex]
      newStartVnode = newChildren[++newStartIndex]
    } 
    // 向前插入元素 abcd -> eabcd
    else if (isSameVnode(oldEndVnode, newEndVnode)) { // 看后面是没有否一样
      patch(oldStartVnode, newStartVnode) // 用新的属性来更新老的属性
      oldEndVnode = oldChildren[--oldEndIndex]
      newEndVnode = newChildren[--newEndIndex]
    } 
    // 倒序功能 abcd -> dcba
    else if (isSameVnode(oldStartVnode, newEndVnode)) {
      patch(oldStartVnode, newEndVnode) 
      parent.insertBefore(oldStartVnode.el, oldEndVnode.el.nextSibling)
      oldStartVnode = oldChildren[++oldStartIndex]
      newEndVnode = newChildren[--newEndIndex]
    }
    // 将尾部插入到了最前面 abcd -> dabc
    else if (isSameVnode(oldEndVnode, newStartVnode)) {
      patch(oldEndVnode, newStartIndex)
      parent.insertBefore(oldEndVnode.el, oldStartVnode.el);
      oldEndVnode = oldChildren[oldEndIndex]
      newStartVnode = newChildren[++newStartIndex]
    }
    // 两个列表的乱序
    else {
      /* 
        会先拿新节点的第一项，去老节点中匹配，
        如果匹配不到，直接将这个节点插入到老节点开头的前面
        如果能查找，到直接移动老节点
        可能老节点中还有剩余，则直接删除老节点中剩余的属性      
      */
      let moveIndex = map[newStartVnode.key]
      if (moveIndex == undefined) {
        parent.insertBefore(createElm(newStartVnode), oldStartVnode.el);
      } else {
        // 我要移动这个元素
        let moveVnode = oldChildren[moveIndex]
        oldChildren[moveIndex] = undefined
        patch(moveVnode, newStartVnode)
        parent.insertBefore(moveVnode.el, oldStartVnode.el)
      }
      newStartVnode = newChildren[++newStartIndex]
    }
  }

  if (newStartIndex <= newEndIndex) {
    // 可能往前面插入，也可能是往后面插入
    // inserBefore(插入的元素, null) <=> appendChild 在尾插入
    let ele = newChildren[newEndIndex + 1] == null ? null : newChildren[newEndIndex+1].el // 要插入的元素
    parent.insertBefore(createElm(newChildren[i]), ele)
  }
  if (oldStartIndex <= oldEndIndex) {
    for (let i = oldStartIndex; i <= oldEndIndex; i++) {
      let child = oldChildren[i] 
      if (child != undefined) {
        parent.remove(child.el)
      }
    }
  }
}
