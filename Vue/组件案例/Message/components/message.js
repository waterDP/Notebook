import Vue from "vue"
import MessageComponent from "./message.vue"

let MessageConstructor = Vue.extend(MessageComponent)
const Message = (options) => {
  // 统一的入口
  let instance = new MessageConstructor({
    data: options  // 给这个组件传入了data数据
  })
  instance.$mount() // 表示挂载组件 这个挂载后的结果会放到instace.$el中
  document.body.appendChild(instance.$el)
  instance.visible = true;  
}

['success', 'error', 'warning'].forEach(type => {
  Message[type] = function(options) {
    options.type = type
    return Message(options)
  }
})

export {Message}