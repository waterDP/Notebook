/*
 * @Author: water.li
 * @Date: 2022-04-16 20:38:06
 * @Description:
 * @FilePath: \note\Vue\vue源码\compiler\html-parser.js
 */
const ncname = `[a-zA-Z][\\-\\.0-9_a-zA-Z]*`
const qnameCapture = `((?:${ncname}\\:)?${ncname})`
const startTagOpen = new RegExp(`^<${qnameCapture}`)  // 标签开头的正则，捕获的内容是标签名
const endTag = new RegExp(`^<\\/${qnameCapture}[^>]*>`)
const attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/
const startTagClose = /^\s*(\/?)>/

export function parseHTML(html) {
  let root = null // root是最后的返回值
  let currentParent
  let stack = []
  const ELEMENT_TYPE = 1
  const TEXT_TYPE = 3

  function createASTElement(tagName, attrs) {
    return {
      tag: tagName,
      type: ELEMENT_TYPE,
      children: [],
      attrs,
      parent: null
    }
  }

  function start(tagName, attrs) {
    // 遇到开始标签就创建一个ast元素
    let element = createASTElement(tagName, attrs)
    if (!root) {
      root = element
    }
    if (currentParent) {
      element.parent = currentParent
      currentParent.children.push(element)
    }
    currentParent = element
    stack.push(element)  // 将开始标签存入栈中
  }
  
  
  function end() {
    // 弹栈 并让当前节点指向栈顶
    stack.pop()
    currentParent = stack[stack.length - 1]
  }


  function chars(text) {
    text = text.replace(/\s/g, '') // 去掉前后空格
    if (text) {
      currentParent.children.push({
        text,
        parent: currentParent,
        type: TEXT_TYPE
      })
    }
  }

  function advance(n) {
    html = html.substring(n)
  }

  function parseStartTag() {
    let start = html.match(startTagOpen)
    if (start) {
      const match = {
        tagName: start[1],
        attrs: []
      }
      advance(start[0].length) // 将标签删除
      let end, attr
      while (!(end = html.match(startTagClose)) && (attr = html.match(attribute))) {
        // 将属性进行解析
        advance(attr[0].length) // 将属性去掉
        match.attrs.push({ name: attr[1], value: attr[3] || attr[4] || attr[5]|| true })
      }
      if (end) { // 去掉开始标签>
        advance(end[0].length)
      }
      return match
    }
  }

  // 不停的去解析html字符串
  while (html) {
    let textEnd = html.indexOf('<')
    if (textEnd === 0) {
      // 如果当前索引为0 肯定是一个标签 开始标签 结束标签
      let startTagMatch = parseStartTag() // 通过这个方法获取匹配的结果 tagName, attrs
      if (startTagMatch) {
        start(startTagMatch.tagName, startTagMatch.attrs)
        continue
      }
      let endTagMatch = html.match(endTag)
      if (endTagMatch) {
        advance(endTagMatch[0].length)
        end()
        continue
      }
    }
    if (textEnd > 0) {
      let text = html.substring(0, textEnd)
      if (text) {
        advance(text.length)
        chars(text)
      }
    }
  }

  return root
}