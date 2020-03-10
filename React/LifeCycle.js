import React, { Component } from 'react';

export class LifeCycle extends Component {
  /**
   * 默认属性，如果你传了，就用这里面的值如果你没有传，就会用默认的值
   */
  static defaultProps = {
    name: '计数器'
  }
  constructor(props) {
    super(props)
    this.state = {
      number: 0
    }
    console.log('1. 初始化 props and state')
  }
  // 在渲染过程中可能会执行多次
  componentWillMount() {
    console.log('2. 组件将要挂载')
  }
  // 一般是在component中执行副作用的操作
  // 永远只会执行一次
  componentDidMount() {
    console.log('4. 组件挂载完成')
  }
  // 调用些方法时会把新的属性对象和新的状态对象
  shouldComponentUpdate(nextProps, nextState) {
    console.log('5. 询问组件是否需要更新')
    return true
  }
  componentWillUpdate() {
    console.log('6. 组件将要更新')
  }
  componentDidUpdate() {
    console.log('7. 组件更新完成')
  }
  componentWillReceiveProps() {
    console.log('8. 属性将要更新')
  }
  componentWillUnmount() {
    console.log('9. ')
  }
  add = () => {
    this.setState({ number: this.state.number + 1 })
  }

  // 新 跟据新的属性对象派生 状态对象
  static getDerivedStateFromProps(nextProps, prevState) {
    return {data: Date.now()}
  }
  // 组件更新前的快照 返回的值会返回到componentDidUpdate的第三个参数 
  getSnapshotBeforeUpdate() {

  }

  render() {
    console.log('3. render渲染，也是挂载')
    return (
      <div>
        <p>{this.state.number}</p>
        <button onClick={this.add}>+</button>
        {this.state.number % 2 == 0 && <SubContainer number={this.state.number} />}
      </div>
    );
  }
}
