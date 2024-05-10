/*
 * @Author: water.li
 * @Date: 2023-04-07 20:32:28
 * @Description:
 * @FilePath: \Notebook\React\packages\src\react-dom-bindings\src\events\ReactDOMEventListener.js
 */
import getEventTarget from "./getEventTarget";
import { getClosestInstanceFromNode } from "../client/ReactDOMComponentTree";
import { dispatchEventForPluginEventSystem } from "./DOMPluginEventSystem";

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
 * @param {*} domEventName 事件名 click
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

/**
 * 此方法就是委托给容器的回调，当容器#root在捕获或者说冒泡阶段，处理事件的时候，会执行此函数
 * @param {*} domEventName
 * @param {*} eventSystemFlags
 * @param {*} targetContainer
 * @param {*} nativeEvent
 */
export function dispatchEvent(
  domEventName,
  eventSystemFlags,
  targetContainer,
  nativeEvent
) {
  // 获取事件源 它是一个真实产DOM
  const nativeEventTarget = getEventTarget(nativeEvent);
  const targetInst = getClosestInstanceFromNode(nativeEventTarget);
  dispatchEventForPluginEventSystem(
    domEventName, // click
    eventSystemFlags, // 0 4
    nativeEvent, // 原生事件
    targetInst, // 此真实DOM对应的fiber
    targetContainer // 目标容器
  );
}
