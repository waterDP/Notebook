// todo jsonp

// todo cors
xhr.withCredentials = true // 允许ajax的cookie跨域访问
/* request 设置请求头 */
// 允许哪个源，可以访问我
res.setHeader('Access-Control-Allow-Origin', '*')
// 允许携带哪个头访问我
res.setHeader('Access-Control-Allow-Headers', 'name')
// 允许哪个方法访问我
res.setHeader('Access-Control-Allow-Methods', 'PUT')
// 允许携带cookie
res.setHeader('Access-Control-Allow-Credentials', true)
// 预检的存活时间 options
res.setHeader('Access-Control-Max-Age', 6)
// 允许前端获取哪个头 
res.setHeader('Access-Control-Expose-Headers', 'name')

// todo postMessage
`<iframe src='http://localhost:3000/b.html' onload='load()'></iframe>`
// window.a
function load() {
  const b = document.getElementById('b')
  b.contentWindow.postMessage('data', 'http://localhosit:3000')
}

// window b
window.onmessage(e => e.source.postMessage('aaaa', e.origin))

// todo window.name
// todo hash
// todo document.domain 一级域名与二级域名的通信
// todo websocket 
// todo proxy