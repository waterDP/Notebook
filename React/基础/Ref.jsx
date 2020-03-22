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
let TextInput = React.forwardRef(TextInput2)
function TextInput2(props, ref) {
  return <input type="text" ref={ref}/>
}
ReactDOM.render(<Sum />, document.getElementById('root'))