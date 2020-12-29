import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import Context from './context'

/**
 * @param {function} mapStateToProps
 * @param {function} mapDispatchToProps
 */
export default function (mapStateToProps, mapDispatchToProps) {
  return function (WrappedComponent) {
    return class extends Component {
      static contextType = Context // this.context
      constructor(props, context) {
        super(props)
        this.state = mapStateToProps(context.store.getState())
      }
      componentDidMount() {
        this.unsubcribe = this.context.store.subscribe(() => {
          this.setState(mapStateToProps(this.context.store.getState()))
        });
      }
      componentWillUnmount() {
        this.unsubcribe()
      }
      render() {
        let actions = {}
        if (typeof mapDispatchToProps === 'function') {
          actions = mapDispatchToProps(this.context.store.dispatch)
        } else {
          actions = bindActionCreators(mapDispatchToProps, this.context.store.dispatch)
        }

        return <WrappedComponent
                dispatch={this.context.store.dispatch} 
                {...this.state} 
                {...actions} 
                {...props}
              />
      }
    }
  }
}