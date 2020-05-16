import React from "react"
import ReactDOM from "react-dom"

class Sum extends React.Component {
  add = () => {
    let numA = this.refs.numA.value
    let numB = this.refs.numB.value
    let result = parseInt(numA) + parseInt(numB)
    this.refs.result.value = result
  }
  render() {
    return (
      <>
        <input type="text" ref="numA"/> +
        <input type="text" ref="numB"/>
        <button onClick={this.add}>=</button>
        <input type="text" ref="result"/>
      </>
    )
  }
}

class Sum2 extends React.Component {
  add = () => {
    let numA = this.numA.value
    let numB = this.numB.value
    let result = parseInt(numA) + parseInt(numB)
    this.result.value = result
  }
  render() {
    return (
      <>
        <input type="text" ref={inst => this.numA = inst}/> +
        <input type="text" ref={inst => this.numB = inst}/>
        <button onClick={this.add}>=</button>
        <input type="text" ref={inst => this.result = inst}/>
      </>
    )
  }
}

class Sum3 extends React.Component {
  constructor(props) {
    super(props)
    this.numA = React.createRef()
    this.numB = React.createRef()
    this.result = React.createRef()
  }
  add = () => {
    let numA = this.numA.current.value
    let numB = this.numB.current.value
    let result = parseInt(numA) + parseInt(numB)
    this.result.current.value = result
  }
  render() {
    return (
      <>
        <input type="text" ref={this.numA}/> +
        <input type="text" ref={this.numB}/>
        <button onClick={this.add}>=</button>
        <input type="text" ref={this.resultk}/>
      </>
    )
  }
}

// 转换ref
const FancyButton = React.forwardRef((props, ref) => {
  <button ref={ref} className="FancyButtons">
    {props.children}
  </button>
})


function MyFancy() {
  const ref = React.createRef()
  return (
    <FancyButton ref={ref}></FancyButton>
  )
}

// ref.current

// todo 在高阶组件中转发refs
function logProps(Component) {
  class LogProps extends React.Component {
    componentDidMount(prevProps) {
      console.log('old props:', prevProps)
      console.log('new Props:', this.props)
    }
    render() {
      const {forwardRef, ...rest} = this.props
      // 将自定义的prop属性'forwardRef'定义为ref
      return <Component ref={forwardRef} {...rest} />
    }
  }
  // 注意React.forwardRef回调的第二个参数ref
  // 我们可以将其作为常规prop属性传递给LogProps，例如forwardRef
  // 然后它就可以被挂载到被LogProps包裹的子组件上
  return React.forwardRef((props, ref) => {
    return <LogProps {...props} forwardRef={ref} />
  })
}