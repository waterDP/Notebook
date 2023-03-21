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

const HooksDispatcherOnMount = {
  useReducer: mountReducer,
};

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
  return [hook.memorized, dispatch];
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
  // 需要在函数组件执行前给ReactCurrentDispatcher.current赋值
  ReactCurrentDispatcher.current = HooksDispatcherOnMount;
  const children = Component(props);
  return children;
}
