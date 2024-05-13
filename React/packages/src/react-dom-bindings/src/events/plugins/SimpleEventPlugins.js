/*
 * @Author: water.li
 * @Date: 2023-04-07 20:32:28
 * @Description:
 * @FilePath: \Notebook\React\packages\src\react-dom-bindings\src\events\plugins\SimpleEventPlugins.js
 */
import {
  registerSimpleEvents,
  topLevelEventsToReactNames,
} from "../DOMEventProperties";
import { IS_CAPTURE_PHASE } from "../EventSystemFlags";
import { accumulateSinglePhaseListeners } from "../DOMPluginEventSystem";
import { SyntheticMouseEvent } from "../SyntheticEvent";

/**
 * 把要执行回调函数添加到dispatchQueue中
 * @param {*} dispatchQueue 派发队列，里面放置我们的监听函数
 * @param {*} domEventName DOM事件名 click
 * @param {*} targetInst 目录fiber
 * @param {*} nativeEvent 原生事件
 * @param {*} nativeEventTarget 原生事件源
 * @param {*} eventSystemFlags 事件系统标识 0表示冒泡 4表示捕获
 * @param {*} targetContainer 目标容器 div#root
 */
function extractEvents(
  dispatchQueue,
  domEventName,
  targetInst,
  nativeEvent,
  nativeEventTarget, // click => onClick
  eventSystemFlags,
  targetContainer
) {
  const reactName = topLevelEventsToReactNames.get(domEventName); // click => onClick
  const isCapturePhase = (eventSystemFlags & IS_CAPTURE_PHASE) !== 0; // 是否是捕获阶段
  let SyntheticEventCtor; // 合成事件的构造函数
  switch (domEventName) {
    case "click":
      SyntheticEventCtor = SyntheticMouseEvent;
      break;
    default:
      break;
  }
  const listeners = accumulateSinglePhaseListeners(
    targetInst,
    reactName,
    nativeEvent.type,
    isCapturePhase
  );
  // 如果有要执行的监听函数
  if (listeners.length) {
    const event = new SyntheticEventCtor(
      reactName,
      domEventName,
      null,
      nativeEvent,
      nativeEventTarget
    );
    dispatchQueue.push({
      event, // 合成事件的实例
      listeners, // 监听函数的数组
    });
  }
}

export { registerSimpleEvents as registerEvents, extractEvents };
