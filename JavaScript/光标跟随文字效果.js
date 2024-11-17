
function getLastTestNode(node) {
  if (node.nodeType === Node.TEXT_NODE) {
    return node
  }
  let children = node.childNodes
  for (let i = children.length - 1; i >= 0; i--) {
    let lastNode = getLastTestNode(children[i])
    if (lastNode) {
      return lastNode
    }
  }
  return null
}


function updateCursor() {
  // 找到最后一个文字节点
  const lastTextNode = getLastTestNode(textElem)
  // 加文字 
  const tempText = document.createTextNode('水')
  if (lastTextNode) {
    lastTextNode.parentNode.appendChild(tempText)
  } else {
    textElem.appendChild(tempText)
  }
  // 根据文字位置设置光标位置 
  const range = document.createRange()
  range.setStart(tempText, 0)
  range.setEnd(tempText, 0)
  const rect = range.getBoundingClientRect()
  const textRect = textContainer.getBoundingClientRect()
  const x = rect.left - textRect.left
  const y = rect.top - textRect.top
  cursor.style.transform = `translate(${x}px, ${y}px)`
  // 删除文字
  tempText.remove()
}