
/*
 * @Author: water.li
 * @Date: 2022-04-09 17:32:20
 * @Description: 
 * @FilePath: \note\Vue\vue-next\packages\runtime-core\src\renderer.ts
 */
import { ReactiveEffect } from "packages/reactivity/src/effect"
import { ShapeFlags } from "packages/shared/src/shapeFlags"
import { createAppAPI } from "./apiCreateApp"
import { createComponentInstance, setupComponent } from "./component"
import { isSameVNodeType, normalizeVNode, Text } from "./createVnode"
import getLIS from "./getLIS"

export function createRenderer(renderOptions) {

  const {
    insert: hostInsert,
    remove: hostRemove,
    pathProp: hostPatchProp,
    createElement: hostCreateElement,
    createText: hostCreateText,
    createComment: hostCreateComment,
    setText: hostSetText,
    setElementText: hostSetElementText,
    parentNode: hostParentNode,
    nextSibling: hostSibling
  } = renderOptions

  const setupRenderEffect = (initialVNode, instance, container) => {
    // 创建渲染effect
    // 核心就是调用render 数据变化 就重新调用render
    const componentUpdateFn = () => {
      let {proxy} = instance // render中的参数
      if (!instance.isMounted) {
        // 组件初始化的流程
        // 调用render方法（渲染页面的时候会取值，那么取值的时候会进行依赖收集）
        // 收集对应的effect，稍后属性变化了会重新执行当前方法
        const subTree = instance.subTree = instance.render.call(proxy, proxy) // 渲染的时候会调用h方法 
        
        // 真正渲染组件 其实渲染的应该是subTree
        patch(null, subTree, container) // 稍后渲染完subTree 会生成真实节点 之后挂载到时subTree
        initialVNode.el = subTree.el

        instance.isMounted = true
      } else {
        // 组件更新的流程 可以做diff算法 比较前后树
        const prevTree = instance.subTree
        const nextTree = instance.render.call(proxy, proxy)
        patch(prevTree, nextTree, container)
      }
    }
    const effect = new ReactiveEffect(componentUpdateFn)
    // 默认调用effect方法 就会执行componentUpdateFn
    const update = effect.run.bind(effect)
    update()
  }

  const mountComponent = (initialVNode, container) => {
    // 根据组件的虚拟节点 创造一个真实节点，渲染到容器中
    // 1.我们要给这个组件创建一个组件的实例 
    const instance = initialVNode.component = createComponentInstance(initialVNode)

    // 2.给组件的实例时行赋值操作
    setupComponent(instance) // 给实例赋属性

    // 3.调用render方法 组件的渲染逻辑。如果依赖的状态发生变化，组件重新渲染
    // 数据和视图是双向绑定的 如果数据变化，视图要更新 
    setupRenderEffect(initialVNode, instance, container)
  }

  const processComponent = (n1, n2, container) => {
    if (n1 === null) {
      // 组件的初始化 直接挂载
      mountComponent(n2, container)
    } else {
      // 组件的更新
    }
  }

  const mountChildren = (children, container) => {
    for (let i = 0; i < children.length; i++) {
      const child = (children[i] = normalizeVNode(children[i]))
      patch(null, child, container)
    }
  }

  const mountElement = (vnode, container, anchor) => {
    // vnode中的children 可能是字符串 或者是数组 对象数组 字符串数组 
    let {type, props, shapeFlag, children} = vnode

    let el = vnode.el = hostCreateElement(type) 

    if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
      hostSetElementText(el, children)
    } else if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
      mountChildren(children, el)
    }

    // 处理属性
    if (props) {
      for (const key in props) {
        hostPatchProp(el, key, null, props[key]) // 给元素添加属性
      }
    }

    hostInsert(el, container, anchor)
  }

  const patchProps = (oldProps, newProps, el) => {
    if (oldProps === newProps) {
      return 
    }
    for (let key in newProps) {
      const prev = oldProps[key]
      const next = newProps[key]
      if (prev !== next) {
        hostPatchProp(el, key, prev, next)
      }
    }
    for (let key in oldProps) { // 老的有 新的没有  移除老的
      if (!(key in newProps)) {
        hostPatchProp(el, key, oldProps[key], null)
      }
    }
  }

  const unmountChildren = children => {
    for (let i = 0; i < children.length; i++) {
      unmount(children[i])
    }
  }

  const patchKeyedChildren = (c1, c2, container) => {
    let e1 = c1.length - 1
    let e2 = c2.length - 1
    let i = 0 // 从头开始比较
    // 1.sync from start 从头开始一个一个孩子来比较 
    while (i < e1 && i < e2) {
      const n1 = c1[i]
      const n2 = c2[i]
      if (isSameVNodeType(n1, n2)) { // 如果两个节点是相同节点 则需要递归比较孩子 和 自身的属性
        patch(n1, n2, container)
      } else {
        break
      }
      i++
    }
 
    // sync from end 从尾部开妈一个一个向前来比较
    while (i < e1 && i < e2) {
      const n1 = c1[e1]
      const n2 = c2[e2]
      if (isSameVNodeType(n1, n2)) { // 如果两个节点是相同节点 则需要递归比较孩子 和 自身的属性
        patch(n1, n2, container)
      } else {
        break
      }
      e1--
      e2--
    }
    

    // common sequence + mount
    if (i > e1) {
      if (i <= e2) {
        const nextPos = e2 + 1
        const anchor = nextPos < c2.length ? c2[nextPos].el : null
        // 参数物anchor的目的是判断向后插入还是向前插入
        while (i <= e2) {
          patch(null, c2[i], container, anchor)
          i++
        }
      }
    } else if (i > e2) { // 如果e2比i小 说明 老的多新的少 common sequence + unmount
      while (i <= e1) {
        // i 和 e1之间的就是要删除的
        unmount(c1[i])
        i++
      }
    }

    // unknown sequence
    let s1 = i  // 老的孩子列表
    let s2 = i  // 新的孩子列表

    // 根据新的节点 创造一个映射表 用老的列表去里面找有没有 如果有 则复用 没有就删除 最后新的就追加
    const keyToNewIndexMap = new Map() // 这个目的是为了可以用老的来查看有没有新的
    for (let i = s2; i < e2; i++) {
      const child = c2[i]
      keyToNewIndexMap.set(child.key, i)
    }
    
    const toBepatched = e2 - s2 + 1
    const newIndexToOldMapIndex = new Array(toBepatched).fill(0)

    
    // 拿老的去新的中查找
    // 找到一样的需要patch
    for (let i = s1; i <= e1; i++) { // 新的索引映射到老的索引的映射表
      const prevChild = c1[i]
      let newIndex = keyToNewIndexMap.get(prevChild.key)
      if (newIndex === undefined) {
        unmount(prevChild) // 删掉这个多余的
      } else {
        newIndexToOldMapIndex[newIndex - s2] = i + 1

        // 比较两个的节点
        patch(prevChild, c2[newIndex], container) // 填表后还要比对属性和儿子
      }
    }

    // 再去移动需要移动的元素
    const queue = getLIS(newIndexToOldMapIndex)
    let j = queue.length - 1 // 拿到最长递增子序列的末尾索引

    for (let i = toBepatched -1; i >= 0; i--) {
      let lastIndex = s2+i
      let lastChild = c2[lastIndex]
      let anchor = lastChild + 1 < c2.length ? c2[lastIndex+1].el : null
      if (newIndexToOldMapIndex[i] === 0) { // 没有就插入新的 这个真实的节点还不存在，要创建一个新的节点 然后插入
        patch(null, lastChild, container, anchor)
      } else {
        if (i !== queue[j]) {
          hostInsert(lastChild.el, container, anchor)
        } else {
          j-- // 这里做了一个优化，表示元素不需要移动了
        }
      }
    }
  }

  const patchChildren = (n1, n2, el) => {
    const c1 = n1 && n1.children
    const c2 = n2 && n2.children
    const prevShapeFlag = c1.shapeFlag
    const shapeFlag = c2.shapeFlag
    // c1 和 c2儿子有哪些类型
    // 1 之前是数组 现在是文本 删除老的节点 用新文本替换掉
    // 2 之前是数组 现在也是数组 比较两个儿子列表的差异
    // 3 之前是文本 现在是空 直接删除老的即可
    // 4 之前是文本现在也是文本
    // 5 之前是文本，现在是数组  删除文本 新增儿子
    // 6 之前是空 现在是文本
    if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
      if (prevShapeFlag & ShapeFlags.ARRAY_CHILDREN) {
        unmountChildren(c1) // 之前是数组 现在是文本 则删除掉之前的所有孩子 
      }
      if (c1 !== c2) { // 之前是文本 现在也是文本
        hostSetElementText(el, c2)
      }
    } else {
      if (prevShapeFlag & ShapeFlags.ARRAY_CHILDREN) {
        if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
          // 比对两个数组的差异
          patchKeyedChildren(c1, c2, el)
        } else {
          // 之前是数组 现在不是数组 
          unmountChildren(c1)
        }
      } else {
        // 之前是文本
        if (prevShapeFlag & ShapeFlags.TEXT_CHILDREN) {
          hostSetElementText(el, '')
        }
        if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
          // 现在是数组
          mountChildren(c2, el)
        }
      }
    }
  }

  const patchElement = (n1, n2) => {
    let el = n2.el = n1.el
    const oldProps = n1.props||{}
    const newProps = n2.props||{}
    patchProps(oldProps, newProps, el) // 比较属性

    // 比较儿子 diff算法 我们的diff算法是同级别比较的
    patchChildren(n1, n2, el)  // 用新的儿子n2与老的儿子n1 进行比对 比对后更新容器元素  
  }

  const processElement = (n1, n2, container, anchor) => {
    if (n1 === null) {
      // 初始化
      mountElement(n2, container, anchor)
    } else {
      // diff
      patchElement(n1, n2) // 更新两个元素之间的差异
    }
  }

  const processText = (n1, n2, container) => {
    if (n1 === null) {
      // 文本初始化
      const textNode = hostCreateText(n2.children)
      n2.el = textNode
      hostInsert(textNode, container)
    }
  } 

  const unmount = (vnode) => {
    hostRemove(vnode.el)  // 删除真实节点即可
  }
  
  const patch = (n1, n2, container, anchor = null) => {
    if (n1 === n2) return 
    const {shapFlag, type} = n2

    // 如果前后元素不一致 需要删除元素 换成新的元素
    if (n1 && !isSameVNodeType(n1, n2)) {
      unmount(n1)
      n1 = null
    }

    switch(type) {
      case Text:
        processText(n1, n2, container)
        break;
      default: 
        if (shapFlag & ShapeFlags.COMPONENT) {
          processComponent(n1, n2, container)
        } else if (shapFlag & ShapeFlags.ELEMENT) {
          processElement(n1, n2, container, anchor)
        }
    }
  }

  const render = (vnode, container) => { 
    patch(null, vnode, container) // 后续更新 prevNode nextNode container
  }

  return {
    createApp: createAppAPI(render),
    render
  }
}