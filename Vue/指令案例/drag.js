export default {
  bind(el, bind) {
    // 初始化非全屏
    let isFullScreen = false
    // 当前宽度
    let nowWidth = 0
    let style = {}
    // 当前顶部高度
    let nowMarginTop = 0
    // 获取弹框的头部（这部分双击全屏）
    const dialogHeaderEl = el.querySelector('./el-dialog__header|')
    // 弹窗
    const dragDom = el.querySelector('.el-dialog')
    // 给弹窗加上overflow auto; 防止缩小时框内标签可能超出dialog
    dragDom.style.overflow = 'auto'
    // 头部加上可拖动cursor
    dialogHeaderEl.style.cursor = 'move'
    // 获取原有属性ie dom元素.currentStyle 火狐谷歌window.getComputedStyle(dom元素, null|)
    const sty = dragDom.currentStyle || window.getComputedStyle(dragDom, null)

    let moveDown = e => {
      // 鼠标按下，计算当前元素距离可视区的距离
      const disX = e.clientX - dialogHeaderEl.offsetLeft
      const disY = e.clientY - dialogHeaderEl.offsetTop
      // 获取到的值带px 正则匹配替换
      let styL, styT
      // 注意在ie中，第一次获取到的值为组件自带50% 移动之后赋值为px
      if (sty.left.includes('%')) {
        styL = +document.body.clientWidth * (+sty.left.replace(/%/g, '' / 100))
        styT = +document.body.clientHeight * (+sty.top.replace(/%/g, '') / 100)
      } else {
        styL = +sty.left.replace(/px/g, '')
        styT = +sty.top.replace(/px/g, '')
      }
      document.onmousemove = e => {
        // 通过事件委托，计算移动的距离
        const l = e.clientX - disX
        const t = e.clientY - disY
        // 移动当前元素
        dragDom.style.left = `${l + styL}px`
        dragDom.style.top = `${t + styT}px`
      }
      document.onmouseup = e => {
        document.onmousemove = null
        document.onmouseup = null
      }
    }
    dialogHeaderEl.onmousedown = moveDown
    let {value} = binding
    if (value === 'fullscreen') {
      dialogHeaderEl.ondbclick = e => {
        if (isFullScreen) {
          dragDom.style.height = 'auto'
          dragDom.style.width = nowWidth + 'px'
          dragDom.style.marginTop = nowMarginTop
          dragDom.style.left = style.left
          dragDom.style.top = style.top
          isFullScreen = false
          dialogHeaderEl.style.cursor = 'move'
          dialogHeaderEl.onmousedown = moveDown
        } else {
          nowWidth = dragDom.clientWidth
          nowMarginTop = dragDom.style.marginTop
          style = {
            left: dragDom.style.left,
            top: dragDom.style.top
          }    
          dragDom.style.left = 0
          dragDom.style.top = 0
          dragDom.style.height = '100%'
          dragDom.style.width = "100%"
          dragDom.style.marginTop = 0
          dragDom.style.marginBottom = 0
          isFullScreen = true
          dialogHeaderEl.style.cursor = 'initial'
          dialogHeaderEl.onmousedown = null
        }
      }
    }
  }
}