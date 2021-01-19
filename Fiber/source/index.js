import element from './element'

const container = document.getElementById('root')

// 应用的根
let workInProgressRoot = {
  stateNode: container,  // 此fiber对应的dom节点
  props: {              // fiber的属性
    children: [element]
  },
  /* child,
  return,
  sibling */
}


// 下一个工作单元
let nextUnitOfWork = workInProgressRoot

function workLoop(deadline) {
  // 如果有下一个工作单元，就执行他，返回一个工作单元
  if (nextUnitOfWork && deadline.timeRemainin g()) {
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork)
  }
  if (!nextUnitOfWork) {
    commitRoot()
  }
}

function commitRoot() {
  let currentFiber = workInProgressRoot.firstEffect
  while(currentFiber) {
    if (currentFiber.effectTag === 'PLACEMENT') {
      currentFiber.return.stateNode.appendChild(currentFiber.stateNode)
    }
    currentFiber = currentFiber.nextEffect
  }
  workInProgressRoot = null
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
    workingInProgressFiber = workingInProgressFiber.return // 先指向自己的父节点
  }
}

/**
 * 1.创建真实DOM，并没有挂载
 * 2.创建fiber子树 
 * @param {*} workingInProgressFiber
 * @return {*}
 */
function beginWork(workingInProgressFiber) {
  if (!workingInProgressFiber.stateNode) {
    workingInProgressFiber.stateNode = document.createElement(workingInProgressFiber.type)
    for (let key in workingInProgressFiber.props) {
      if (key !== 'children') {
        workingInProgressFiber.stateNode[key] = workingInProgressFiber.props[key]
      }
    }
    // 在beginWork里面是不会挂载的
  }
  // 创建子fiber
  let previousFiber
  // children是一个虚拟DOM的数组
  if (Array.isArray(workingInProgressFiber.props.children)) {
    workingInProgressFiber.props.children.forEach((child, index) => {
      let childFiber = {
        type: child.type,
        props: child.props,
        return: workingInProgressFiber,
        effectTag: 'PLACEMENT', // 这个节点需要插入到父节点中去
        nextEffect: null, // 下一个有副作用的节点
      }
      if (index == 0) {
        workingInProgressFiber.child = childFiber
      } else {
        previousFiber.sibling = childFiber
      }
      previousFiber = childFiber
    })
  }
}

function completeUnitOfWork(workingInProgressFiber) {
  // 构建副作用链effectList 只有那些有副作用的节点
  let returnFiber = workingInProgressFiber.return 
  if (returnFiber) {
    // 把当前fiber的有副作用子链表挂载到时父节点上
    if (!returnFiber.firstEffect) {
      returnFiber.firstEffect = workingInProgressFiber.firstEffect
    }
    if (workingInProgressFiber.lastEffect) {
      if (returnFiber.lastEffect) {
        returnFiber.lastEffect.nextEffect = workingInProgressFiber.firstEffect
      }
      returnFiber.lastEffect = workingInProgressFiber.lastEffect
    }
    // 再把自己挂上去
    if (workingInProgressFiber.effectTag) {
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
requestIdleCallback(workLoop)