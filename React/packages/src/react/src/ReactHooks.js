/*
 * @Author: water.li
 * @Date: 2023-03-20 22:02:43
 * @Description:
 * @FilePath: \Notebook\React\packages\src\react\src\ReactHooks.js
 */
import ReactCurrentDispatcher from "./ReactCurrentDispatcher";

function resolveDispatcher() {
  return ReactCurrentDispatcher.current;
}

/**
 * @param {*} reducer 处理函数，用于根据老状态和动作计算新状态
 * @param {*} initialArg 初始状态
 */
export function useReducer(reducer, initialArg) {
  const dispatcher = resolveDispatcher();
  return dispatcher.useReducer(reducer, initialArg);
}

export function useState(initialArg) {
  const dispatcher = resolveDispatcher();
  return dispatcher.useState(initialArg);
}
