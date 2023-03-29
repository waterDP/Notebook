/*
 * @Author: water.li
 * @Date: 2023-03-05 21:48:08
 * @Description:
 * @FilePath: \Notebook\React\packages\src\react-reconciler\src\ReactFiberHooks.js
 */
import ReactSharedInterals from "shared/ReactSharedInternals";
import { scheduleUpdateOnFiber } from "./ReactFiberWorkLoop";
import { enqueueConcurrentHookUpdate } from "./ReactFiberConcurrentUpdates";

const { ReactCurrentDispatcher } = ReactSharedInterals;

let currentlyRenderingFiber = null;
let workInProgressHook = null;
let currentHook = null;

const HooksDispatcherOnMount = {
  useReducer: mountReducer,
};

const HooksDispatcherOnUpdate = {
  useReducer: updateReducer,
};

/**
 * 构建新的hooks
 */
function updateWorkInProgressHook() {
  // 获将要构建的新的hook的老hook
  if (currentHook === null) {
    const current = currentlyRenderingFiber.alternate;
    currentHook = current.memorizedState;
  } else {
    currentHook = currentHook.next;
  }

  // 根据老hook创建新hook
  const newHook = {
    memorizedState: currentHook.memorizedState,
    queue: currentHook.queue,
    next: null,
  };
  if (workInProgressHook === null) {
    currentlyRenderingFiber.memorizedState = workInProgressHook = newHook;
  } else {
    workInProgressHook = workInProgressHook.next = newHook;
  }
  return workInProgressHook;
}

function updateReducer(reducer) {
  const hook = updateWorkInProgressHook();
  // 获取新的hook的更新队列
  const queue = hook.queue;
  // 获取老的hook
  const current = currentHook;
  // 获取将要生效的更新队列
  const pendingQueue = queue.pending;
  // 初始化一个新的状态 取值为当前的状态
  let newState = current.memorizedState;
  if (pendingQueue !== null) {
    queue.pending = null;
    const firstUpdate = pendingQueue.next;
    let update = firstUpdate;
    do {
      const action = update.action;
      newState = reducer(newState, action);
      update = update.next;
    } while (update !== null && update !== firstUpdate);
  }
  hook.memorizedState = newState;
  return [hook.memorizedState, queue.dispatch];
}

function mountReducer(reducer, initialArg) {
  const hook = mountWorkInProgressHook();
  hook.memorized = initialArg;
  const queue = {
    pending: null,
    dispatch: null,
  };
  hook.queue = queue;
  const dispatch = (queue.dispatch = dispatchReducerAction.bind(
    null,
    currentlyRenderingFiber,
    queue
  ));
  return [hook.memorizedState, dispatch];
}

/**
 * 执行派发动作的方法，它要更新状态，并且让界面重新更新
 * @param {*} fiber function Component对应的fiber
 * @param {*} queue hook对应的更新队列
 * @param {*} action 派发的动作
 */
function dispatchReducerAction(fiber, queue, action) {
  // 在每个hook里会存放一个更新队列，更新队列是一个更新对象的循环链表
  const update = {
    action, // {type: 'add', payload: 1}
    next: null, // 指向下一个更新
  };
  // 把当前最新的更新添加到更新队列中，并且返回当前的根fiber
  const root = enqueueConcurrentHookUpdate(fiber, queue, update);
  scheduleUpdateOnFiber(root);
}

/**
 * 挂载构建中的Hook
 */
function mountWorkInProgressHook() {
  const hook = {
    memorized: null, // hook状态
    queue: null, // 存放本hook的更新队列 queue.pending = update循环链表
    next: null, // 指向下一个hook 一个函数里面可能会有多个hook 它们会组成一个单向链表
  };
  if (workInProgressHook === null) {
    // 当前函数对应的fiber的状态等于第一个hook对象
    currentlyRenderingFiber.memorized = workInProgressHook = hook;
  } else {
    workInProgressHook = workInProgressHook.next = hook;
  }
  return workInProgressHook;
}

/**
 * 渲染函数组件
 * @param {*} current 老fiber
 * @param {*} workInProgress 新fiber
 * @param {*} Component 组件定义
 * @param {*} props 组件属性
 * @returns 虚拟DOM或者说是React元素
 */
export function renderWithHooks(current, workInProgress, Component, props) {
  currentlyRenderingFiber = workInProgress;
  if (current !== null && current.memorized !== null) {
    //如果有老的Fiber，并且有老的Hook链表
    ReactCurrentDispatcher.current = HooksDispatcherOnUpdate;
  } else {
    // 需要在函数组件执行前给ReactCurrentDispatcher.current赋值
    ReactCurrentDispatcher.current = HooksDispatcherOnMount;
  }
  const children = Component(props);
  currentlyRenderingFiber = null;
  workInProgressHook = null;
  return children;
}
