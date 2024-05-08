/*
 * @Author: water.li
 * @Date: 2023-03-07 22:23:36
 * @Description:
 * @FilePath: \Notebook\React\source\src\react-dom-bindings\src\events\DOMEventProperties.js
 */
import { registerTwoPhaseEvent } from "./EventRegistry";

const simpleEventPluginEvents = ["click", "abort"];

export const topLevelEventsToReactNames = new Map();

function registerSimpleEvent(domEventName, reactName) {
  // ^ 把原生事件名和处理函数的名字进行映射或者说绑定 clik > onClick
  topLevelEventsToReactNames.set(domEventName, reactName);
  registerTwoPhaseEvent(reactName, [domEventName]);
}

export function registerSimpleEvents() {
  for (let i = 0; i < simpleEventPluginEvents.length; i++) {
    const eventName = simpleEventPluginEvents[i];
    const domEventName = eventName.toLowerCase();
    const capitalizeEvent = eventName[0].toUpperCase() + eventName.slice(1); // Click
    registerSimpleEvent(domEventName, `on${capitalizeEvent}`); // click onClick
  }
}
