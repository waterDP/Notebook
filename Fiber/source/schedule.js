/*
 * @Description: 
 * @Date: 2021-01-19 14:03:06
 * @Author: water.li
 * 从根节点开始渲染和调度，分为两个阶段
 * diff阶段，对比新旧的虚拟DOM，进行增量 更新或创建
 *      这个阶段可能比较花时间，可以对任务进行拆分，拆分的维度是虚拟DOM，此阶段可以暂停
 *      render阶段 render阶段的成果是effect list 知道哪些节点更新了，哪些节点删除了，哪些节点增加了
 *       两个任务 1.根据虚拟DOM，造成fiber树 2.收集effectList
 * commit阶段，进行DOM更新创建阶段，此阶段不能暂停
 */
import { ELEMENT_TEXT, PLACEMENT, TAG_HOST, TAG_ROOT, TAG_TEXT } from './constants'
import { setProps } from './utils'


// 应用的根
let workInProgressRoot = null

// 下一个工作单元
let nextUnitOfWork = null

export function scheduleRoot(rootFiber) {
  nextUnitOfWork = rootFiber
  workInProgressRoot = rootFiber
}

function workLoop(deadline) {
  let shouldYield = false // 是否要让出时间片或者说是控制权
  // 如果有下一个工作单元，就执行他，返回一个工作单元
  if (nextUnitOfWork && !shouldYield) {
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork)
    shouldYield = deadline.timeRemaining() < 1
  }
  if (!nextUnitOfWork) {
    // render阶段结束
    commitRoot()
  } 
  // 不管有没有任务，都请求再次调度
  requestIdleCallback(workLoop, {timeout: 500})
}

// todo 提交
function commitRoot() {
  let currentFiber = workInProgressRoot.firstEffect
  while(currentFiber) {
    commitWork(currentFiber)
    currentFiber = currentFiber.nextEffect
  }
  workInProgressRoot = null
}

function commitWork(currentFiber) {
  if (!currentFiber) return
  let returnFiber = currentFiber.return
  let returnDOM = returnFiber.stateNode
  if (currentFiber.effectTag === PLACEMENT) {
    returnDOM.appendChild(currentFiber.stateNode)
  }
  currentFiber.effectTag = null
}

/**
 * beginWork 1.创建此fiber的真实DOM 通过虚拟DOM创建fiber树结构
 * @param {*} workingInProgressFiber
 * @return {*}
 */
function performUnitOfWork(workingInProgressFiber) {  
  // 1.创建真实DOM，并没有挂载
  // 2.创建fiber子树
  beginWork(workingInProgressFiber)
  if (workingInProgressFiber.child) {
    return workingInProgressFiber.child // 如果有儿子，返回儿子
  }
  while(workingInProgressFiber) {
    // 如果没有儿子，当前节点结束
    completeUnitOfWork(workingInProgressFiber)
    if (workingInProgressFiber.sibling) {
      return workingInProgressFiber.sibling // 如果有弟弟，返回弟弟
    }
    workingInProgressFiber = workingInProgressFiber.return // 先指向自己的父节点,让父亲完成
  }
}

/**
 * 1.创建真实DOM，并没有挂载
 * 2.创建fiber子树 
 * @param {*} workingInProgressFiber
 * @return {*}
 */
function beginWork(workingInProgressFiber) {
  if (workingInProgressFiber.tag === TAG_ROOT) {  // 根节点
    updateHostRoot(workingInProgressFiber)
  } else if (workingInProgressFiber.tag === TAG_TEXT) {
    updateHostText(workingInProgressFiber)
  } else if (workingInProgressFiber.tag === TAG_HOST) {
    updateHost(workingInProgressFiber)
  }
}

function updateHost(workingInProgressFiber) {
  if (!workingInProgressFiber.stateNode) {  // 如果此Fiber没有创建DOM节点
    workingInProgressFiber.stateNode = createDOM(workingInProgressFiber)
  }
  const newChildren = workingInProgressFiber.props.children
  reconcileChild(workingInProgressFiber, newChildren)
}

function createDOM(workingInProgressFiber) {
  if (workingInProgressFiber.tag === TAG_TEXT) {
    return document.createTextNode(workingInProgressFiber.props.text)
  }
  if (workingInProgressFiber.type === TAG_HOST) {
    let stateNode = document.createElement(workingInProgressFiber.type)
    updateDOM(stateNode, {}, workingInProgressFiber.props)
    return stateNode
  }
}

function updateDOM(stateNode, oldProps, newProps) {
  setProps(stateNode, oldProps, newProps)
}

function updateHostText(workingInProgressFiber) {
  if (!workingInProgressFiber.stateNode) {  // 如果此Fiber没有创建DOM节点
    workingInProgressFiber.stateNode = createDOM(workingInProgressFiber)
  }
}

function updateHostRoot(workingInProgressFiber) {
  let newChildren = workingInProgressFiber.prop.children
  reconcileChild(workingInProgressFiber, newChildren)
}

function reconcileChild(workingInProgressFiber, newChildren) {
  let newChildIndex = 0  // 新节点的索引
  let prevSibling  // 上一个新的子Fiber
  while(newChildIndex < newChildren.length) {
    let newChild = newChildren(newChildIndex)
    let tag
    if (newChild.type === ELEMENT_TEXT) {
      tag = TAG_TEXT // 这是一个文本节点
    } else if (newChild.type === 'string') {
      tag = TAG_HOST // 如果type是字符串，那么这是一个原生DOM节点
    }
    let newFiber = {
      tag,
      type: newChild.type,
      props: newChild.props,
      stateNode: null, //div还没有创建DOM元素
      return: workingInProgressFiber, // 父fiber returnFiber
      effectTag: PLACEMENT, // 副作用标识 render阶段我们会收集副作用 增加 删除 更新
      nextEffect: null // 单链表
    }

    if (newChildIndex === 0) {
      workingInProgressFiber.child = newFiber
    } else {
      prevSibling.sibling = newFiber
    }
    prevSibling = newFiber
  
    newChildIndex++
  }
}

// todo 收集有副作用的fiber 形成一个effect list
function completeUnitOfWork(workingInProgressFiber) {
  // 构建副作用链effectList 只有那些有副作用的节点
  let returnFiber = workingInProgressFiber.return 
  if (returnFiber) {
    // 把自己儿子的effect链挂到父亲身上
    if (!returnFiber.firstEffect) {
      returnFiber.firstEffect = workingInProgressFiber.firstEffect
    }
    if (workingInProgressFiber.lastEffect) {
      if (returnFiber.lastEffect) {
        returnFiber.lastEffect.nextEffect = workingInProgressFiber.firstEffect
      }
      returnFiber.lastEffect = workingInProgressFiber.lastEffect
    }
    // 把自己挂到父亲身上
    const effectTag = workingInProgressFiber.effectTag
    if (effectTag) {
      if (returnFiber.lastEffect) {
        returnFiber.lastEffect.nextEffect = workingInProgressFiber
      } else {
        returnFiber.firstEffect = workingInProgressFiber
      }  
      returnFiber.lastEffect = workingInProgressFiber
    }
  }
}

// 告诉浏览器在空闲的时候执行workLoop
// 有一个优先级的概念 expirationTime
requestIdleCallback(workLoop, {timeout: 500})