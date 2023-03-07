export const allNativeEvents = new Set();

/**
 * 注册两个阶段的事件
 * @param {*} registraionName React事件名 onClick
 * @param {*} dependencies 原生的事件数组 [click]
 */
export function registerTwoPhaseEvent(registraionName, dependencies) {
  // ^ 注册冒泡事件的对应关系
  registerDirectEvent(registraionName, dependencies);
  // ^ 注册捕获事件的对应关系
  registerDirectEvent(registraionName + "Capture", dependencies);
}

export function registerDirectEvent(registerName, dependencies) {
  for (let i = 0; i < dependencies.length; i++) {
    allNativeEvents.add(dependencies[i]) // click
  }
}