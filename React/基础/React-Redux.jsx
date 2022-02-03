/*
 * @Author: water.li
 * @Date: 2020-12-30 23:04:53
 * @Description: 
 * @FilePath: \notebook\React\基础\React-Redux.jsx
 */
import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import {Provider, connect} from "react-redux"
import store from './store'
import counter from './store/actions/counter'   // action

export class Counter extends Component {
  render() {
    return (
      <>
        <p>{this.props.counter}</p>
        <button onClick={this.props.increment}>+</button>
        <button onClick={this.props.decrement}>-</button>
      </>
    );
  }
}

// connect 负责连接仓库和组件
export default connect(
  state => state,  // mapStateToProps
  counter   // mapDispatchToProps
)(Counter);


/* Root Component */
ReactDOM.render((
  <Provider store={store}>
    <Counter />
  </Provider>
), document.getElementById('root'))
