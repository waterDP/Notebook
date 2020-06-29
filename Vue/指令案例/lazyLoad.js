const getScrollParent = el => {
  let parent = el.parentNode
  while (parent) {
    if (/scroll|auto/.test(getComputedStyle(parent)['overflow'])) {
      return parent
    }
    parent = parent.parentNode
  }
  return parent
}

const loadImgAsync = (src, resolve, reject) => {
  let img = new Image()
  img.src = src
  img.onload = resolve
  img.onerror = reject
}

const Lazy = Vue => {
  
  class ReactiveListener {
    constructor({el, src, options, elRender}) {
      this.el = el
      this.src = src
      this.options = options
      this.elRender = elRender
      this.state = {
        loading: false // 没有加载过
      }
    }
    checkView() { // 检测这个图片是否在可视区域中
      let {top} = this.el.getBoundingClientRect()
      return top < window.innerHeight * (this.options.preLoad || 1.3)
    }
    load() { // 用来渲染
      this.elRender(this, 'loading')
      loadImgAsync(this.src, () => {
        this.state.loading = true
        this.elRender(this, 'finish')
      }, () => {
        this.elRender(this, 'error')
      })
    }
  }

  return class LazyClass {
    constructor(options) {
      this.options = options
      this.bindHandler = false
      this.listenerQueue = []
    }
    add(el, bindings, vnode) {
      Vue.nextTick(() => {
        // 带有滚动的盒子
        let scrollParent = getScrollParent(el)
        if (scrollParent && !this.bindHandler) {
          this.bindHandler = true
          scrollParent.addListener('scroll', this.handleLazyLoad.bind(this))
        }
      })
      // 判断当前的这个元素是否在窗口的可视区域中，如果不是，就不用渲染
      const listener = new ReactiveListener({
        el,
        src: bindings.value,
        options: this.options,
        elRender: this.elRender.bind(this)
      })
      this.listenerQueue.push(listener)
      this.handleLazyLoad()
    }
    handleLazyLoad() {
      // 计算当前图片的位置
      this.listenerQueue.forEach(listener => {
        if (!listener.state.loading) {
          let catIn = listener.checkView()
          catIn && listener.load()
        }
      })
    }
    elRender(listener, state) {
      let el = listener.el
      let src = ''
      switch(state) {
        case 'loading':
          src = listener.options.loading || ''
          break
        case 'error':
          src = listener.options.error || ''  
          break
        default:
          src = listener.src
          break  
      }
      el.setAttribute(el, 'src', src)
    }
  }
}

export default {
  install(Vue, options) {
    const LazyClass = Lazy(Vue)
    const lazy = new LazyClass(options)
    Vue.directives('lazy', {
      bind: lazy.add.bind(lazy)
    })
  }
}