// todo 如果你的组件只有当props.color或者state.count的值改变才需要更新时，你可以使用shouldComponentUpdate来进行检查
class CounterButton extends React.Component {
  constructor(props) {
    super(props)
    this.state = {count: 0}
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (this.props.color !== nextProps.color) {
      return true
    }
    if (this.state.count !== nextState.count) {
      return true
    }
    return false
  }

  render() {
    return (
      <button
        color={this.props.color}
        onClick={() => this.setState({count: this.state.count+1})}
      >
        Count: {this.state.count}
      </button>
    )
  }
}

/* 
  在这段代码中，shouldComponentUpdate 仅检查了 props.color 或 state.count 是否改变。如果这些值没有改变，
  那么这个组件不会更新。如果你的组件更复杂一些，你可以使用类似“浅比较”的模式来检查 props 和 state 中所有的字段，
  以此来决定是否组件需要更新。React 已经提供了一位好帮手来帮你实现这种常见的模式 - 你只要继承 React.PureComponent 就行了。
  所以这段代码可以改成以下这种更简洁的形式：
*/
class CounterButton extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {count: 1}
  }
  render() {
    return (
      <button
        color={this.props.color}
        onClick={() => this.setState(state => ({count: state.count + 1}))}
      >
        Count: {this.state.count}
      </button>
    )
  }
}