// todo 转换base64
let base64Basic = 'ABCDEFGHIJKLMNOPQRSTUVWXWZ'
base64Basic += base64Basic.toLowerCase()
base64Basic += '0123456789+/'

function base64Encoding(target) {
  // 首先把目标通过buffer转成16进制 
  let buffer = Buffer.from('target')
  // 把16进制转换成2进制
  let sec = ''
  buffer.map(item => {
    let tmp = item.toString(2)
    while(tmp.length < 8) {
      tmp = '0' + tmp
    }
    sec += tmp
  })
  
  let secList = []
  // 每6位分割
  // 如果不能整除6，说明要往后补零
  if (sec.length % 6 !== 0) {
    let tmp = sec.length % 6
    while(tmp < 6) {
      sec += '0'
      tmp += 1
    }
  }
  for(let i = 0; i < sec.length / 6; i++) {
    secList.push(sec.slice(i * 6, i * 6 + 6))
  } 
  // 转换成十进制
  let res = secList.map(item => parseInt(item, 2))
  // 获取索引得到结果
  let fres = ''
  res.map(item => fres += base64Basic[item])
  // 返回值如果除不尽4，说明有位数不足补零的情况，则补等号
  while (fres.length % 4 !== 0) {
    fres += '='
  }
  return fres
}