
export function stdChannel() {
  let currentTakers = []
  /**
   * @param {function} cb 回调函数
   * @param {function} matcher 匹配器 
   */
  function take(cb, matcher) { //  订阅
    cb['MATCHER'] = matcher
    taker.cancel = () => currentTakers = currentTakers.filter(item => item !== taker)
    currentTakers.push(cb)
  }
  function put(input) { // 发布
    currentTakers.forEach(taker => {
      taker['MATCH'](input) && (taker.cancel(), taker(input))
    })
  }

  return {
    take, 
  }
}