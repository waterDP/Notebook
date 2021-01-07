import React from 'react'
import RouterContext from './context'
import pathToRegexp from 'path-to-regexp'

export default class Route extends React.Component {
  static contextType = RouterContext
  render() {
    let { pathname } = this.context.location
    let { path = '/', component: Component, exact = false, render, children } = this.props
    let paramNames = []
    let regexp = pathToRegexp(path, paramNames, { end: exact })
    let result = pathname.match(regexp)

    let props = {
      location: this.context.location,
      history: this.context.history
    }

    if (result) {
      paramNames = paramNames.map(item => item.name);
      let [url, ...values] = result;
      let params = {};
      for (let i = 0; i < paramNames.length; i++) {
        params[paramNames[i]] = values[i];
      }
      props.match = {
        path,
        url,
        isExact: url === pathname,
        params
      }
      if (Component) {
        return <Component {...props} />
      }
      if (render) {
        return render(props);
      }
      if (children) {
        return children(props);
      }
      return null
    }
    if (children) {
      return children(props);
    }
    return null;

  }
}
