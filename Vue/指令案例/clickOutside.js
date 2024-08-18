export default {
  directives: {
    clickOutside: {
      bind(el, binding, vnode) {
        let handler = e => {
          if (el.contains(e.target)) {
            vnode.context.focus()
          } else {
            vnode.context.blur()
          }
        }
        el.handler = handler
        document.addEventListener('clcick', el.handler)
      },
      unbind(el) {
        document.removeEventListener('click', el.handler)
      }
    }
  }
}