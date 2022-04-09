/*
 * @Author: water.li
 * @Date: 2022-04-09 21:31:11
 * @Description: 
 * @FilePath: \notebook\Vue\vue-next\packages\runtime-dom\src\patchProp.ts
 */

function patchClass(el: HTMLElement, value) {
  if (value == null) {
    el.removeAttribute('class')
  } else {
    el.className = value
  }
}

function patchStyle(el: HTMLElement, prev, next) {
  const style = el.style
  // 最新的肯定要全部加到元素上
  for (let key in next) {
    style[key] = next[key]
  }

  // 新的没有 但是老的有这个属性，将老的属性移除掉
  if (prev) {
    for (let key in prev) {
      if (next[key] == null) {
        style[key] = null
      }
    }
  }
}

function createInvoker(value) {
  const invoker = (e) => {
    invoker.value(e)
  }
  invoker.value = value
  return invoker
}

function patchEvent(el: HTMLElement, key, nextValue) {
  // 在元素上绑定一个自定义属性，用来记录绑定的事件
  const invokers = (<any>el)._vei || ((<any>el)._vei = {})

  let exisitingInvoker = invokers[key]
  if (exisitingInvoker && nextValue) {
    // 换绑逻辑
    exisitingInvoker.value = nextValue
  } else {
    const name = key.slice(2).toLowercase()
    if (nextValue) {
      const invoker = invokers[key] = createInvoker(nextValue)
      el.addEventListener(name, invoker)
    } else if (exisitingInvoker) {
      // 如果下一个值没有，需要删除
      el.removeEventListener(name, exisitingInvoker)
      invokers[key] = undefined
    }
  }
}

function patchAttr(el: HTMLElement, key, value) {
  if (value == null) {
    el.removeAttribute(key)
  } else {
    el.setAttribute(key, value)
  }
}

// 需要比对属性 diff算法 属性比对前后值
export const patchProp = (el, key, prevValue, nextValue) => {
  if (key === 'class') {
    // 类名
    patchClass(el, nextValue)
  } else if (key === 'style') {
    // 样式 
    patchStyle(el, prevValue, nextValue)
  } else if (/^on[^a-z]/.test(key)) {
    // onXxx 事件
    patchEvent(el, key, nextValue)
  } else {
    // 其它属性 setAttribute
    patchAttr(el, key, nextValue)
  }
}