export function createEventListenerWrapperWithPripority(
  targetContainer,
  domEventName,
  eventSystemFlags
) {
  const listenerWraper = dispatchDiscreteEvent;

  return listenerWraper.bind(
    null,
    domEventName,
    eventSystemFlags,
    targetContainer
  );
}

/**
 * 派发离散的事件的监听函数
 * @param {*} domEventName 事件名
 * @param {*} eventSystemFlags 阶段 0冒泡  4捕获
 * @param {*} container 容器div#root
 * @param {*} nativeEvent 原生的事件
 */
function dispatchDiscreteEvent(
  domEventName,
  eventSystemFlags,
  container,
  nativeEvent
) {
  dispatchEvent(domEventName, eventSystemFlags, container, nativeEvent);
}

function dispatchEvent(
  domEventName,
  eventSystemFlags,
  container,
  nativeEvent
) {}
