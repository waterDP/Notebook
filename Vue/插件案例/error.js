/**
 * @param {element} obj 
 * @param {string} event 
 * @param {function} callback 
 * @param {boolean} useCapture 
 */
function bind(obj, event, callback, useCapture = false) {
  if (obj.addEventListener) {
    obj.addEventListener(event, callback, useCapture)
  } else {
    obj.attachEvent(`on${event}`, function() {
      callback.call(obj)
    })
  }
}

const install = Vue => {
  /**
   * 监听window.onerror异常事件
   * @param {string}   errorMessage    错误信息 
   * @param {string}   scriptURI       出错的文件
   * @param {long}     lineNumber      出错代码的行号
   * @param {long}     columnNumber    出错代码的列号
   * @param {object}   errorObj        错误的详细信息
   */
  window.onerror = (errorMessage, scriptURI, lineNumber, columnNumber, errorObj) {
    console.log('js异常', errorMessage, scriptURI, `line: ${lineNumber}`, `column: ${columnNumber}`, errorObj)
    return true
  }

  /**
   * 监听全局error带伤，拦截处理
   */
  bind(window, 'error', event => {
    event && event.preventDefault()
  }, true)
  
  /**
   * 监听全局的unhandledrejection事件， 拦截处理
   */
  bind(window, 'unhandledrejection', event => {
    event && event.preventDefault()
  }, true)
}

export default install