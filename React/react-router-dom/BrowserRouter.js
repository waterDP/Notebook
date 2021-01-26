/*
 * @Main: Router组件的作用
 * @Description: 1.收集当前的pathname，然后通过上下文向下层组件传递
 *               2.监听路径的变化，当路径发生变化的时候修改pathname，然后重新渲染组件 ，让下面的Route重新匹配
 */

import React from 'react'
import Context from './context'

// todo AOP 扩展pushstate
let pushState = window.history.pushState
window.history.pushState = (state, title, url) => {
  pushState.call(window.history, state, title, url)
  typeof window.onpushstate === 'function' && window.onpushstate.call(this, state, url)
}

export default class BrowserRouter extends React.Component {
  state = {
    location: { pathname: window.location.pathname, state: null }
  }
  componentDidMount() {
    window.onpopstate = (event) => {
      if (this.block) {
        let confirm = window.confirm(this.block(this.state.location));
        if (!confirm) return;
      }
      this.setState({
        location: {
          ...this.state.location,
          pathname: window.location.pathname,
          state: event.state
        }
      });
    }
    window.onpushstate = (state, pathname) => {
      this.setState({
        location: {
          ...this.state.location,
          pathname,
          state
        }
      });
    }
  }

  render() {
    let value = {
      location: this.state.location,
      history: {
        push: to => {//定义一个history对象，有一个push方法用来跳路径
          if (this.block) {
            let confirm = window.confirm(this.block(typeof to === 'object' ? to : { pathname: to }));
            if (!confirm) return;
          }
          if (typeof to === 'object') {
            let { pathname, state } = to;
            window.history.pushState(state, '', pathname)
          } else {
            window.history.pushState(null, '', to)
          }
        },
        block: message => {
          this.block = message
        }
      }
    }
    return (
      <Context.Provider value={value}>
        {this.props.children}
      </Context.Provider>
    )
  }
}