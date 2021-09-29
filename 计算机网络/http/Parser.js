/*
 * @Description: 使用状态机来解析请求，获取到请求行，请求头 请求体
 * @Date: 2021-01-28 16:56:59
 * @Author: water.li
 */
let LF = 10, // 换行
  CR = 13, // 回车
  SPACE = 32, // 空格
  COLON = 58 // 冒号
let INIT = 0,
  START = 1,
  REQUEST_LINE = 2,
  HEADER_FILED_START = 3, 
  HEAD_FILED = 4,
  HEAD_VALUE_START = 5,
  HEAD_VALUE = 6,
  BODY = 7

class Parser {
  parse(buffer) {
    let self = this,
      requestLine = '',
      headers = {},
      body = '',
      i = 0,
      char,
      headerField = '',
      headerValue = ''
      state = START

    for (i = 0; i < buffer.length; i++) {
      char = buffer(i)
      switch(state) {
        case START: 
          state = REQUEST_LINE
          self['requestLineMark'] = i // 记录请求行开始的索引
        case REQUEST_LINE:
          if (char === CR) { // 回车 \r
            requestLine = buffer.toString('utf8', self['requestLineMark'], i)
            break
          } else if (char === LF) {
            state = HEADER_FILED_START
          } 
          break
        case HEADER_FILED_START: 
          if (char === CR) {
            // 如果是这个，说明下面该读请求体了 
            state = BODY
            self['bodyMark'] = i + 2
          } else {
            state = HEADER_FILED
            self['headerFieldMark'] = i
          } 
        case HEAD_FILED:
          if (char === COLON) {  // 如果是个冒号的话
            headerField = buffer.toString('utf8', self['headerFieldMark'], i)
            state = HEAD_VALUE_START
          }
          break
        case HEAD_VALUE_START:
          if (char === SPACE) {
            break
          }
          self['headValueMark'] = i
          state = HEAD_VAlue
        case HEAD_VALUE:
          if (char === CR) {
            headerValue = buffer.toString('utf8', self['headerValueMark'], i)
            headers[headerField] = headerValue
            headerField = headerValue = ''
          } else if (char === LF) {
            state = HEAD_VALUE_START
          }
          break
      }
    }
    let [method, url] = requestLine.split(' ')
    body = buffer.toString('utf8', self['bodyMark'])
    return {method, url, headers, body}
  }
}

module.exports = Parser