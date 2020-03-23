import React from 'react'
import ReactDOM from 'react-dom'
import {HashRouter as Router, Route} from 'react-router-dom'
// Router是路由容器
ReactDOM.render(
  <Router>
    <>
      <Route path="/" component={Home} exact />
      <Route path="/user" component={User} />
      <Route path="/profile" component={Profile} />
    </>
  </Router>,
  document.getElementById('rooter')
)

import React, { Component } from 'react';

class Home extends Component {
  render() {
    return (
      <div>
        home
      </div>
    );
  }
}

class User extends Component {
  render() {
    return (
      <div>
        user
      </div>
    )
  }
}

class Profile extends Component {
  render() {
    return (
      <div>
        profile
      </div>
    )
  }
}

