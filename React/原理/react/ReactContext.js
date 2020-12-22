import { Component } from "./Component";

export function createContext(defaultValue) {
  let contextValue = defaultValue
  class Provider extends Component {
    render() {
      contextValue = this.props.value
      return this.props.children
    }
  }

  function Consumer(props) {
    return props.children(contextValue)
  }

  return {
    Provider,
    Consumer
  }
} 