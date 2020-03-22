import React, { Component } from 'react';
import {bindActionCreators} from "redux";
import store from './store'
import actions from './store/actions/counter'

let boundActions = bindActionCreators(actions, store.dispatch)

export class ReduxComponent extends Component {
  state = {number: store.getState()}
  componentDidMount() {
    this.unsubscribe = store.subscribe(() => {
      this.setState({number: store.getState().counter})
    })
  }
  componentWillUnmount() {
    this.unsubscribe();
  }
  render() {
    return (
      <>
        <p>{this.state.number}</p>
        <button onClick={()=>boundActions.increment()}>+</button>
        <button onClick={()=>boundActions.increment()}>-</button>
      </>
    );
  }
}

export default ReduxComponent;
