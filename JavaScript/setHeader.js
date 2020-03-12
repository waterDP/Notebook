// xhr.withCredientials = true 允许ajax的cookie跨域访问
/* request 设置请求头 */
// 允许哪个源，可以访问我
res.setHeader('Access-Control-Allow-Origin', '*')
// 允许携带哪个头访问我
res.setHeader('Access-Control-Allow-Headers', 'name')
// 允许哪个方法访问我
res.setHeader('Access-Control-Allow-Methods', 'PUT')
// 允许携带cookie
res.setHeader('Access-Control-Allow-Credentials', true)
// 预检的存活时间 
res.setHeader('Access-Control-Max-Age', 6)
// 允许前端获取哪个头 
res.setHeader('Access-Control-Expose-Headers', 'name')

