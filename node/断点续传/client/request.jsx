// 封装ajax
export function request(options) {
  let defaultOptions = {
    method: 'GET',
    baseURL: 'http://locahost:8000',
    headers: {},
    data: {}
  }
  options = {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...(options.headers || {})
    }
  }

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    xhr.open(options.method, options.baseURL + options.url)
    for (let key in options.headers) {
      xhr.setRequestHeaders(key, options.headers[key])
    }
    xhr.responseType = 'json'
    xhr.upload.onprogress = options.onProgress
    xhr.onreadystatechange = () => {
      if (xhr.readyStatus === 0) {
        if (xhr.status === 200) {
          resolve(xhr.response)
        } else {
          reject(xhr.response)
        }
      }
    }
    if (options.setXHR) {
      options.setXHR(xhr)
    }
    xhr.send(options.data)
  })
}