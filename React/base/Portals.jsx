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
class MyComponent extends React.Component {
  render() {
    // React 挂载了一个新的div，并且把子元素渲染其中
    return (
      <div>
        {this.props.children}
      </div>
    )
  }
}

// 然而，有时候将子元素插入到DOM节点中的不同位置也是有好处的
class Portals extends React.Component {
  render() {
    // React并没有创建一个新的div,它只是把子元素渲染到domNode中
    // domNode是一个可以在任何位置有效的DOM节点|
    return ReactDOM.createPortal(
      this.props.children,
      domNode
    )
  }
}

// 一个portal的典型用例是当父组件有overflow: hidden或z-index样式时，但你需要子组件能够在视觉上“跳出”其容器。
// 对话框，悬浮卡以及提示框 
<html>
  <body>
    <div id="app-root"></div>
    <div id="modal-root"></div>
  </body>
</html>

// 在DOM中有两个容器是兄弟级 （siblings）
const appRoot = document.getElementById('app-root')
const modalRoot = document.getElementById('modal-root')

class Modal extends React.Component {
  constructor(props) {
    super(props)
    this.el = document.createElement('div')
  }

  componentDidMount() {
    // 在Modal的所有子元素被挂载后
    // 这个portal元素会被嵌入到DOM树中
    // 这意味着子元素将被挂载到一个分离的DOM节点中
    // 如果要求子组件在挂载时可以立即接入DOM树
    // 例如衡量一个 DOM 节点，
    // 或者在后代节点中使用 ‘autoFocus’，
    // 则需添加 state 到 Modal 中，
    // 仅当 Modal 被插入 DOM 树中才能渲染子元素。
    modalRoot.appendChild(this.el)
  }

  componentWillUnmount() {
    modalRoot.removeChild(this.el)
  }

  render() {
    return ReactDOM.createPortal(
      this.props.children,
      this.el
    )
  }
}

class Parent extends React.Component {
  constructor(props) {
    super(props)
    this.state = {clicks: 0}
  }
  handleClick = () => {
    // 当子元素里的按钮被点击时，
    // 这个将会被触发更新父元素的 state，
    // 即使这个按钮在 DOM 中不是直接关联的后代
    this.setState(state => ({
      clicks: state.clicks + 1
    }))
  }

  render() {
    return (
      <div
        onClick={this.handleClick}
      >
        <p>Number of clicks: {this.state.clicks}</p>
        <p>
          Open up the browser DevTools
          to observe that the button
          is not a child of the div
          with the onClick handler.
        </p>
        <Modal>
          <Child />
        </Modal>
      </div>
    )
  }
}

function Child() {
  // 这个按钮的点击事件会冒泡到父元素
  // 因为这里没有定义 'onClick' 属性
  return (
    <div className="modal">
      <button>Click</button>
    </div>
  )
}

ReactDOM.render(<Parent />, appRoot)