// todo Event对象

/* 创建一个事件对象，名字为newEvent,类型为build */
let newEvent = new Event('build', {bubbles: true, cancelable: true, composed: true})

/* 给这个事件对象创建一个属性并赋值 */
newEvent.name = '新的事件'

/* 将自定事件绑定在document对象上，事件类型要相同 */
document.addEventListener('build', () => {
  // ...
})

/* 触发这个事件 */
document.dispatchEvent(newEvent)

/**
 * event = new Event(typeArg, eventInit)
 * @param typeArg 指定事件类型，传递一个字符串。这里的事件类型指的是像点击事件，提交事件等等
 * @param eventInit 可选，传递一个EventInit类型的事件。
 *        bubbles: 事件事件否支持冒泡，传递一个boolean类型的参数，默认值为false
 *        cancelable: 是否可取消事件的默认行为，传递一个boolean类型的参数，默认值为false
 *        composed: 事件是否会触发shadow Dom(阴影DOM)根节点之外的监听吕，传递一个boolean类型的参数，默认值为false
 */

// todo CustomEvent对象 用法同上