/*
 * @Description: 
 * @Date: 2021-07-22 15:05:21
 * @Author: water.li
 */
import lookup from './lookup'

// tokens数组变为dom字符串
export default function renderTemplate(tokens, data) {
  let resultStr = ''
  for (let i = 0;  i < tokens.length; i++) {
    const token  = tokens[i] 
    if (token[0] == 'text') {
      resultStr += token[1]
    } else if (token[0] == 'name') {
      resultStr += lookup(data, token[1])
    } else if (token[0] == '#') {
      resultStr += parseArray(token, data)
    }
  }
  return resultStr
}

function parseArray(token, data) {
  const v = lookup(data, token[1])
  let resultStr = ''
  for(let i = 0; i < v.length; i++) {
    // 这里要补充一个.的键
    resultStr += renderTemplate(token[2], {
      '.': v[i],
      ...v[i]
    })
  }
  return resultStr
}