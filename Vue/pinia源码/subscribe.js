/*
 * @Author: water.li
 * @Date: 2024-09-29 21:38:46
 * @Descrip
 * @FilePath: \Notebook\Vue\pinia源码\subscribe.js
 */

export function addSubscription(subscriptions, callback) {
  subscriptions.push(callback)
  const removeSubscription = () => {
    const index = subscriptions.indexOf(callback)
    if (index > -1) {
      subscriptions.splice(index, 1)
    }
  }
  return removeSubscription
}

export function triggerSubscriptions(subscriptions, ...args) {
  subscriptions.slice().forEach( cb => cb(...args));
}