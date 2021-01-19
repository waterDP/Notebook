import { Component } from "./Component";

export function createContext(defaultValue) {
  let context = {_currentValue: null}
  class Provider extends Component {
    render() {
      context._currentValue = this.props.value
      return this.props.children
    }
  }

  function Consumer(props) {
    const {child} = props
    return child(context._currentValue)
  }

  context.Provider = Provider
  context.Consumer = Consumer

  return context
} 