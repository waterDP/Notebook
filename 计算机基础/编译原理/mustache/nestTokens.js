/*
 * @Description: 
 * @Date: 2021-07-22 14:18:02
 * @Author: water.li
 */
/**
 * 将#和/之间的tokens能够整合起来
 */
export default nestTokens(tokens) {
  const nestedTokens = []
  const sections = []
  let collector = nestedTokens

  for (let i = 0; i < tokens.length; i++) {
    let token = tokens[i]
    switch(token[0]) {
      case '#':
        collector.push(token)
        sections.push(token)
        // 收集器要换人了，给token添加下标为2的项，并且让收集器指向它
        collector = token[2] = [] 
        break
      case '/': 
        // 出栈
        sections.pop()
        // 改变收集器为栈结构队尾 栈顶
        collector = 
          sections.length ? sections[sections.length - 1][2] : nestedTokens
        break
      default:
        collector.push(token)
    }
  }

  return nestTokens
}