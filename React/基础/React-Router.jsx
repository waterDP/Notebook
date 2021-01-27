import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { HashRouter as Router, Route, Switch, Redirect, Link } from 'react-router-dom'
// Router是路由容器
ReactDOM.render(
  <Router>
    <>
      <div>
        <Link to="/"></Link>
        <Link to="/user"></Link>
        <Link to="/profile"></Link>
      </div>
      <Switch>
        <Route path="/" component={Home} exact />
        <Route path="/user" component={User} />
        <Route path="/profile" component={Profile} />
        <Redirect to='/'></Redirect>
      </Switch>
    </>
  </Router>,
  document.getElementById('rooter')
)

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

