/** 
 * Flip
 * first 记录要监控的元素位置
 * last 记录要变化结构变化后的位置
 * invert
 * play 
 */

const btn = document.querySelector('button')
const list = document.querySelector('.list')
const firstItem = document.querySelector('.list-item:first-child')
const lastItem = document.querySelector('.list-item:last-child')

function getLocation() {
  const rect = firstItem.getBoundingClientRect()
  return rect.top()
}

const start = getLocation()

btn.onclick = () => {
  list.insertBefore(firstItem, null)
  // 记录它的结束的位置
  const end = getLocation()

  const dis = start - end
  firstItem.style.transform = `tranlateY(${dis})`

  raf(() => {
    firstItem.style.transition = 'transform 1s'
    firstItem.style.removeProperty('transform')
  })
}

function raf(callback) {
  requestAnimationFrame(() => {
    requestAnimationFrame(callback)
  })
}