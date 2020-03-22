class Component {
  constructor(props) {
    this.props = props
  }
  get isReactComponent() {
    return true
  }
  setState(partialState) {
    // 第一个参数是新的元素  第二个参数是新的状态
    this._currentUnit.update(null, partialState)
  }
}
export {
  component
}