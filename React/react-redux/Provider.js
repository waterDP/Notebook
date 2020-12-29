import React, { Component } from 'react'
import Context from './context'
export default class extends Component {
  render() {
    return (
      <Context.Provider value={{ store: this.props.store }}>
        {this.props.children}
      </Context.Provider>
    )
  }
}
