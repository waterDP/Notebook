import { peek, pop, push } from "scheduler/src/forks/SchedulerMinHeap"
import { IdlePriorty, ImmediatePriorty, LowPriorty, NormalPriorty, UserBlockPriorty } from "scheduler/src/forks/SchedulerPriorties"

function getCurrentTime() {
  return performance.now()
}

const maxSigned31BitInt = 1073741823

// 立刻过期
const IMMEDIATE_PRIORITY_TIMEOUT = -1
const USER_BLOCKING_PRIORITY_TIMEOUT = 250
// 正常优先级的过期时间 
const NORMAL_PRIORITY_TIMEOUT = 5000
// 低优先级过期时间
const LOW_PRIORITY_TIMEOUT = 10000
// 永远不过期
const IDLE_PRIORITY_TIMEOUT = maxSigned31BitInt

// 任务Id计数器
let taskIdCounter = 1
// 任务的最小堆
const taskQueue = []

let scheduleHostCallback = null
let startTime = null
let currentTask = null
// React每帧向浏览器申请5ms用于自己任务执行
const frameInterval = 5

const channel = new MessageChannel()
let port1 = channel.port1
let port2 = channel.port2
port1.onmessage = performWorkUntilDeadline

/**
 * 按优先级执行任务
 * @param {*} priorityLevel 
 * @param {*} callback 
 */
export function scheduleCallback(priorityLevel, callback) {
  // 获取当前前的时间
  const currentTime = getCurrentTime()
  // 此任务的当前时间
  startTime = currentTime
  // 超时时间
  let timeout
  switch (priorityLevel) {
    case ImmediatePriorty:
      timeout = IMMEDIATE_PRIORITY_TIMEOUT
      break;
    case UserBlockPriorty:
      timeout = USER_BLOCKING_PRIORITY_TIMEOUT
      break
    case IdlePriorty:
      timeout = IDLE_PRIORITY_TIMEOUT
      break
    case LowPriorty:
      timeout = LOW_PRIORITY_TIMEOUT
      break
    case NormalPriorty:
    default:
      timeout = NORMAL_PRIORITY_TIMEOUT
      break
  }
  // 计算此任务的过期时间
  const expirationTime = startTime + timeout
  const newTask = {
    id: taskIdCounter++,
    callback, // 回调函数或者说是任务函数
    priorityLevel, // 优先级别
    startTime, // 开始时间
    expirationTime, // 任务的过期时间
    sortIndex: expirationTime, // 排序依据 
  }
  // 向任务最小堆里添加任务，排序的依据是最小的过期时间
  push(taskQueue, newTask)
  requestHostCallback(flushWork)
  return newTask
}

/**
 * 开始执行任务队列的任务
 * @param {*} startTime 
 */
function flushWork(startTime) {
  return workLoop(startTime)
}

function shouldYieldToHost() {
  // 用当前的时间减去开始时间就是过去的时间
  const timeElapsed = getCurrentTime() - startTime
  if (timeElapsed < frameInterval) {
    return false
  }
  return true
}

function workLoop(startTime) {
  let currentTime = startTime
  // 取出优先级最高的任务
  currentTask = peek(taskQueue)
  while (currentTask !== null) {
    // 如果此任务的过期时间小于当前时间，也就是说没有过期，并且需要放弃执行
    if (currentTask.expirationTime > currentTime && shouldYieldToHost()) {
      // 跳出工作循环
      break
    }
    // 取出当前的任务中的回调函数
    const callback = currentTask.callback
    if (typeof callback === 'function') {
      currentTask.callback = null
      const didUserCallbackTimeout = currentTask.expirationTime <= currentTime
      const continuationCallbck = callback(didUserCallbackTimeout)
      if (typeof continuationCallbck === 'function') {
        currentTask.callback = continuationCallbck
        return true //还有任务要执行
      }
      // 如果此任务已经完成，则不需要再继续执行了，可以把此任务弹出
      if (currentTask === peek(taskQueue)) {
        pop(taskQueue)
      }
    } else {
      pop(taskQueue)
    }
    // 如果当前的任务执行完成，或者当前的任务不合法，取出下一个任务执行
    currentTask = peek(taskQueue)
  }
  if (currentTask !== null) {
    return true
  }
  return false
}

function requestHostCallback(workLoop) {
  // 先缓存回调函数
  scheduleCallback = workLoop
  // 执行工作直到截止时间
  schedulePerformWorkUntilDeadline()
}

function schedulePerformWorkUntilDeadline() {
  port2.postMessage(null)
}

function performWorkUntilDeadline() {
  if (scheduleCallback) {
    startTime = getCurrentTime()
    let hasMoreWork = true
    try {
      // 执行flushWork,并判断有没有返回值
      hasMoreWork = scheduleHostCallback(startTime)
    } finally {
      // 执行完以后如果为true，说明还有更多工作要做
      if (hasMoreWork) {
        // 继续执行
        schedulePerformWorkUntilDeadline()
      } else {
        scheduleHostCallback = null
      }
    }
  }
}

export {
  shouldYieldToHost as shouldYield,
  IdlePriorty, ImmediatePriorty, LowPriorty, NormalPriorty, UserBlockPriorty
}