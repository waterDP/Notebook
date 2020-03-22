import {createUnit} from "./src/unit"
import {createElement} from "./element"

let React = {
  render,
  createElement,
  rootIndex: 0
}

// 此元素可以有是一个文本节点 Dom节点(div)
function render(element, container) {
  let unit = createUnit(element)
  let markUp = unit.getMarkUp(Root.rootIndex)  //  用来返回html标记
  $(container).html(markUp)
  $(document).trigger('mounted')
}

export default React
