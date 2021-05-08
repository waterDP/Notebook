class HttpRest {
  // todo ajax请求的5个readyState状态
  // 状态0 Uninitialized 初始化状态。XMLHttpRequest对象创建或已被 abort()方法重置。
  // 状态1 Open Open()方法已调用，但是send()方法未调用。请求还未被发送。	  
  // 状态2 Sent Send()方法已调用，Http请求已发送到到Web服务器。未接收到响应。
  // 状态3 Receiving 所有响应头都已经接收到。响应体开始接收未完成。
  // 状态4 Loaded HTTP响应已经完全接收。
  // readyState的值不会递减，除非当一个请求在处理的过程中的时候调用了 abort() 或 open()方法。每次这个属性的值增加的时候，都会触发onreadystatechange事件。	
  constructor() {
    this.xhr = this._initial()
  }
  /**
   * @private
   * @return xhr
   */
  _initial() {
    // 判断是否支持XMLHttpRequest对象
    // Chrome,Firefox,Opera, 8.0+, Safari
    if (window.XMLHttpRequest) {
      return new XMLHttpRequest()
    }
    return new ActiveXObject()
  }
  /**
   * @private
   * @param {string} url
   * @param {string} method
   * @param {object} data
   * @param {function} success
   * @param {function} failure
   * @param {boolean} async 
   */
  _send(url, method, data, success, failure, async) {
    // 发送请求
    this.xhr.open(method, url, async)
    // onreadystatechange函数
    this.xhr.onreadystatechange = () => {
      // readyState的值等于4，从服务器拿到时数据
      if (this.xhr.readyState === 4) {
        // 请求的整个过程中有五种状态，且同一时刻只能存在一种状态：
        // 0：请求未初始化（还没有调用 open()）。
        // 1：请求已经建立，但是还没有发送（还没有调用 send()）。
        // 2：请求已发送，正在处理中（通常现在可以从响应中获取内容头）。
        // 3：请求在处理中；通常响应中已有部分数据可用了，但是服务器还没有完成响应的生成。
        // 4：响应已完成；您可以获取并使用服务器的响应了。
        // 当请求状态发生改变时，触发 onreadystatechange 会被调用
        // 如果响应体成功下载，并且服务端返回 200 状态码
        const {status, responseText: result} = this.xhr
        if (status === 200) {
          // 打印响应信息
          const response = {
            data: JSON.parse(this.xhr.response),
            status,
            result
          }
          success(response)
        } else {
          failure(new Error(`request error status is: ${status}`))
        }
      }
    }
    if (method === 'GET') {
      this.xhr.send()
    } else {
      this.xhr.send(JSON.stringify(data))
    }
  }
  /**
   * @public
   * @param {string} url
   * @param {object} data
   * @param {boolean} async
   * @return {Promise}
   */
  get(url, data = {}, async = true) {
    const query = []
    Object.keys(data).forEach(key => {
      query.push(`${encodeURIComponent(key)}=${encodeURIComponent(data[key])}`)
    })
    return new Promise((resolve, reject) => {
      this._send(url, 'GET', null, resolve, reject, async)
    })
  }
  /**
   * @public
   * @param {string} url
   * @param {object} data
   * @param {boolean} async
   * @return {Promise} 
   */
  post(url, data, async = false) {
    return new Promise((resolve, reject) => {
      this._send(url, 'POST', data, resolve, reject, async)
    })
  }
}