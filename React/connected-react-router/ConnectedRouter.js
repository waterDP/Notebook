import React, { Component } from 'react'
import {LOCATION_CHANGE} from './constants';
import {ReactReduxContext} from 'react-redux';
import {Router} from 'react-router';//react-router-dom是浏览器端的Router
//hashRouter 
export default class ConnectedRouter extends Component {
  static contextType = ReactReduxContext
  componentDidMount(){
      //每当路径发生变化之后，都会执行此监听函数，并传入二个参数新的路径的新的动作
     this.unlistener = this.props.history.listen((location,action)=>{
        this.context.store.dispatch({
            type:LOCATION_CHANGE,
            payload:{location,action}
        });
     });
  }
  componentWillUnmount(){
    this.unlistener();
  }
  render() {
    let {history,children} = this.props;
    // HashRouter 向下层传递history location match
    return (
      <Router history={history}>
          {children}
      </Router>
    )
  }
}
/**
 * HashRouter就是一个拥有了hashhistory的ReactRouter
 * <Router history={createHashHistory()}><Router>
 */