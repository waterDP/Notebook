Vue.prototype.$broadcast = function(componentName, eventName) {
  let children = this.$children
  let arr = []
  function findChildren(children) {
    children.forEach(child => {
      if (child.$options.name === componentName) {
        if (eventName) {
          child.$emit(eventName)
        } else {
          arr.push(child)
        }
        if (child.$children && child.$children.length) {
          findChild(child.$children)
        }
      }
    })
  }
  findChildren(children)
  return arr
}