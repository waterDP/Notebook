import { Component } from './Component'

export function forwardRef(FunChild) {
  return class extends Component {
    render() {
      return FunChild(this.props, this.ref)  // ! 这个ref不能直接用 
    }
  }
}