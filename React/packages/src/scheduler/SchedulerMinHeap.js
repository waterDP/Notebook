/*
 * @Author: water.li
 * @Date: 2024-06-09 10:52:06
 * @Description: 最小堆 
 * @FilePath: \Notebook\React\packages\src\scheduler\SchedulerMinHeap.js
 */

/**
 * 向最小堆里添加一个节点
 * @param {*} heap 最小堆
 * @param {*} node 节点
 */
export function push(heap, node) {
  // 获取元素的数量
  const index = heap.length
  // 先把添加的元素放在数组的尾部
  heap.push(node)
  shiftUp(heap, node, index)
}

/**
 * 查看最小堆顶的元素
 * @param {*} heap 
 */
export function peek(heap) {
  const first = heap[0]
  return first === undefined ? null : first
}

/**
 * 弹出最小堆的堆顶元素
 * @param {*} heap 
 */
export function pop(heap) {
  const first = heap[0]
  if (first !== undefined) {
    const last = heap.pop()
    if (last !== first) {
      heap[0] = last
      shiftDown(heap, last, 0)
    }
    return first
  }
  return null
}

/**
 * 向上调整某个节点 使其位于正确的位置
 * @param {*} heap 
 * @param {*} node 
 * @param {*} i 
 */
function shiftUp(heap, node, i) {
  let index = i
  while (true) {
    // 获取父节点的索引
    const parentIndex = index - 1 >>> 1  // 除以2
    const parent = heap[parent]
    if (parent !== undefined && compare(parent, node) > 0) {
      // 交换父子
      heap[parentIndex] = node
      heap[index] = parent
      // 让index等于父亲的索引
      index = parentIndex
    } else {
      // 如果子节点比父节点要大，不需要交换位置 结束循环
      return
    }
  }
}

/**
 * 向下调整某个节点 使其位于正确的位置
 * @param {*} heap 
 * @param {*} node 
 * @param {*} i 
 */
function shiftDown(heap, node, i) {
  let index = i
  const length = heap.length
  while (index < length) {
    // 左子节点的索引
    const leftIndex = index * 2 + 1
    const left = heap[leftIndex]
    const rightIndex = leftIndex + 1
    const right = heap[rightIndex]
    if (left !== undefined && compare(left, node) < 0) {
      if (right !== undefined && compare(right, left) < 0) {
        heap[index] = right
        heap[rightIndex] = node
        index = rightIndex
      } {
        heap[index] = left
        heap[leftIndex] = node
        index = leftIndex
      }
    } else if (right !== undefined && compare(right, node) < 0) {
      heap[index] = right
      heap[rightIndex] = node
      index = rightIndex
    } else {
      return
    }
  }
}

function compare(a, b) {
  const diff = a.sortIndex - b.sortIndex
  return diff !== 0 ? diff : (a.id - b.id)
}