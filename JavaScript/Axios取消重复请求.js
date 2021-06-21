/*
 * @Description: 
 * @Date: 2021-06-21 09:44:19
 * @Author: water.li
 */


// todo 如何判断重复请求
// 当请求方式，请求url地址和请求参数都一样时，我们就可以认为请求是一样的

/**
 * @description: 用于根据当前请求的信息，生成请求key 
 * @param {*}
 * @return {*}
 */
function generateReqKey(config) {
  const {method, url, params, data} = config
  return [method, url, qs.stringify(params), qs.stringify(data)].join('&')
}

/**
 * @description: 用于把当前请求信息添加到pendingRequest对象 
 * @param {*}
 * @return {*}
 */
const pendingRequest = new Map()

function addPendingRequest(config) {
  const requestKey = generateReqKey(config)

  config.cancelToken =  
    config.cancelToken || new  axios.cancelToken(cancel => {
      if (!pendingRequest.has(requestKey)) {
        pendingRequest.set(requestKey, cancel)
      }
    })
}

/**
 * @description: 检查是否存在重复请求，若存在则取消已发的请求 
 * @param {*}
 * @return {*}
 */
function removePendingRequest(config) {
  const requestKey = generateReqKey(config)
  if (pendingRequest.has(requestKey)) {
    const cancelToken = pendingRequest.get(requestKey)
    cancelToken(requestKey)
    pendingRequest.delete(requestKey)
  }
}


// todo 设置请求拦截器
axios.interceptors.request.use(config => {
  removePendingRequest(config) // 检查是否存在重复请求，若存在则取消已发的请求
  addPendingRequest(config) // 把当前请求信息添加到pendingRequest对象中
  return config
}, error => {
  return Promise.reject(error)
})

// todo 设置响应拦截器
axios.interceptors.response.use(response => {
  removePendingRequest(response.config)
  return response
}, error => {
  removePendingRequest(error.config || {})
  if (axios.isCancel(error)) {
    console.log('已取消的重复讲求：' + error.message)
  } else {
    // 添加异常处理
  }
  return Promise.reject(error)
})