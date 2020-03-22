import { render } from "react-dom"

/** 
 * todo: Portal 提供了一种将子节点渲染到存在于父组件以外的DOM节点的优秀的方法 
 */
ReactDOM.createPortal(child, container)
/** 
 * 第一个参数(child)是任何可以渲染的React子元素，例如一个元素，字符串或fragment
 * 第二个参数(container)是一个DOM元素 
 */ 
/** 
 * todo 用法
 * 通常来讲，当你从组件的render方法返回一个元素时，该元素将被挂载到DOM节点中离其最近的父爷点
 */
render() {
  // React 挂载了一个新的div，并且把子元素渲染其中
  return (
    <div>
      {this.props.children}
    </div>
  )
}

// 然而，有时候将子元素插入到DOM节点中的不同位置也是有好处的
render() {
  // React并没有创建一个新的div,它只是把子元素渲染到domNode中
  // domNode是一个可以在任何位置有效的DOM节点|
  return ReactDOM.createPortal(
    this.props.children,
    domNode
  )
}