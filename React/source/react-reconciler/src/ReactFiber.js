/*
 * @Author: water.li
 * @Date: 2023-01-03 23:24:58
 * @Description:
 * @FilePath: \Notebook\React\源码\react-reconciler\src\ReactFiber.js
 */
import { HostRoot } from './ReactWorkTags'
import { NoFlags } from './ReactFiberFlags'  
/**
 * 
 * @param {*} tag fiber的类型 函数组件0   类组件1 原生组件5 根元素3等
 * @param {*} pendingProps 新属性，等待处理或说生效的属性
 * @param {*} key 唯一标识
 */
export function FiberNode(tag, pendingProps, key) {
  this.tag = tag
  this.key = key
  this.type = null // fiber类型 来自于 虚拟DOM的type div p span
  this.stateNode = null // 此fiber对应的真实的DOM节点
  
  this.return = null
  this.child = null
  this.sibling = null

  this.pendingProps = pendingProps  // 等待生效的属性
  this.memoizedProps = null  // 已经生效的属性

  this.memoizedState = null
  this.updateQueue = null
  
  this.flags = NoFlags // 副作用的标识，表示要针对此fiber节点进行何种操作
  this.subtreeFlags = NoFlags // 子节点对应的副作用的标识
  // 替身 轮替 DOM-DIFF
  this.alternate = null
}

export function createFiber(tag, pendingProps, key) {
  return new FiberNode(tag, pendingProps, key)
}

export function createHostRootFiber() {
  return createFiber(HostRoot, null, null)
}