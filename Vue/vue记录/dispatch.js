Vue.prototype.$dispatch = function(componentName, eventName) {
  let parent = this.$parent
  while(parent) {
    let name = parent.$options.name
    if (name === componentName) {
      break
    } else {
      parent = parent.$parent
    }
  }
  if (parent) {
    if (eventName) {
      parent.$emit(eventName)
    } 
    return parent
  }
}