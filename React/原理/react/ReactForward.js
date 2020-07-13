import {Component} from './ReactBaseClasses'
export function forwardRef(functionComponent) {
  return class extends Component {
    render() {
      return functionComponent(this.props, this.props.refs)
    }
  }
}