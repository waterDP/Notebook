/*
 * @Description: 
 * @Date: 2021-01-29 10:11:14
 * @Author: water.li
 */
const crypto = require('crypto')
const CODE = '258EAFA5-E914-47DA-95CA-C5AB0DC85B11'

exports.toAcceptKey = function(wsKey) {
  return crypto.createHash('sha1')
    .update(wsKey + CODE)
    .digest('base64')
}

exports.unmask = function(buffer, mask) {
  const length = buffer.length
  for (let i =0; i < length; i++) {
    buffer[i] ^= mask[i % 4]
  }
}

exports.toHeaders = function(rows) {
  let headers = {}
  rows.forEach(row => {
    let [key, value] = row.split(': ')
    headers[key] = value
  })

  return headers
}