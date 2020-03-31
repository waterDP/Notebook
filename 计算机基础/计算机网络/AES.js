const crypto = require("crypto")
function encrypt(data, key, iv) {
  let cipher = crypto.createCipheriv("aes-128-gcm", key, iv)
  cipher.update(data)
  return cipher.final('hex')  // 16进制 
}

function decrypt(data, key, iv) {
  let cipher = crypto.createDecipheriv('aes-128-gcm', key, iv)
  cipher.update(data, 'hex')  // 添加hev也就是16进制的字符串数据
  return cipher.final('utf8') // 返回成utf8格式的字符串
}