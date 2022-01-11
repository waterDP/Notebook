import React, { Component } from 'react';

export class LifeCycle extends Component {
  /**
   * 默认属性，如果你传了，就用这里面的值。如果你没有传，就会用默认的值
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
  UNSAFE_componentWillMount() {}
  componentWillMount() {
    console.log('2. 组件将要挂载')
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
  static getDerivedStatePromProps(props, state) {
    return {
      fatherText: props.state
    }
  }
  // 一般是在component中执行副作用的操作
  // 永远只会执行一次
  componentDidMount() {
    console.log('4. 组件挂载完成')
  }
  // 调用些方法时会把新的属性对象和新的状态对象传入
  // 此方法中不能调用setState，否则会造成死循环
  shouldComponentUpdate(nextProps, nextState) {
    console.log('5. 询问组件是否需要更新')
    return true
  }
  UNSAFE_componentWillUpdate() {}
  componentWillUpdate() {
    console.log('6. 组件将要更新')
  }
  componentDidUpdate(prevProps, prevState, ...) {
    console.log('7. 组件更新完成')
  }
  // UNSAFE_componentWillReceiveProps(){}
  // componentWillReceiveProps() { // todo 属性发生改变
  //   console.log('8. 属性将要更新')
  // }
  
  // componentWillUnmount() {
  //   console.log('9. 组件即将卸载')
  // }
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

  static getDerivedStateFromProps(nextProps, prevState) {

    return {}  // 返回一个当前的状态
  }

}


/**
 * ! React 生命周期洋葱模型
 *   parent.componentWillMount
 *   parent.render
 *     child.componentWillMount
 *     child.render
 *       ...
 *     child.componentDidMount
 *   parent.componentDidMount  
 */

/**
 * ! Vue 生命周期洋葱模型
 * todo 加载渲染过程 
 * 父beforeCreate->父created->父beforeMount(父render)
 *    子beforeCreate->子created->子beforeMount(子render)->子mounted
 * 父mounted
 * 
 * todo 子组件更新过程
 * 父beforeUpdate
 *   子beforeUpdate->子updated
 * 父updateUpdate
 * 
 * todo 父组件更新过程
 * 父beforeUpdate-> 父update
 * 
 * todo 销毁过程
 * 父beforeDestroy
 *    子beforeDestroy -> 子destroyed
 * 父destroyed
 */