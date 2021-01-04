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
    const {child} = props
    return child(contextValue)
  }

  return {
    Provider,
    Consumer
  }
} 