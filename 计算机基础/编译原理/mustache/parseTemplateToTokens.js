/*
 * @Description: 
 * @Date: 2021-07-22 13:59:03
 * @Author: water.li
 */
import Scanner from './Scanner'
import nestTokens from './nestTokens'

/**
 * 将模板字符串转成tokens
 */
export default function parseTemplateToTokens(templateStr) {
  const tokens = []
  const scanner = new Scanner(templateStr)
  let words
  while (!scanner.eos()) {
    // 收集开始标记之前的所有文字
    words = scanner.scanUtil("{{")
    words && tokens.push(['text', words])
    scanner.scan('{{')

    words = scanner.scanUtil('}}') 
    if (words !== '') {
      // 这个words就是{{}}中间的东西，判断一下首字符
      if (words[0]=='#') {
        tokens.push(['#', words.substring(1)])
      } else if (words[0] == '/') {
        tokens.push(['/', words.substring(1)])
      } else {
        tokens.push(['name', words])
      }
    }
    scanner.scan('}}')
  }
  return nestTokens(tokens)
}