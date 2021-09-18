Vue.prototype.$broadcast = function(componentName, eventName, event) {
  let children = this.$children
  function findChildren(children) {
    children.forEach(child => {
      if (child.$options.name === componentName) {
        eventName && child.$emit(eventName, event)
      }
      if (child.$children && child.$children.length) {
        findChildren(child.$children)
      }
    })
  }
  findChildren(children)
}