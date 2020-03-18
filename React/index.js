import React from 'react'
import ReactDOM from 'react-dom'  

const style = {
  color: 'red'
}
function Greeting(props) {
  if (props.userName) {
    return <h1 style={style}>欢迎{props.userName}</h1>
  }
  return <h1 style={style}>欢迎光临</h1>
}

class Title extends React.Component {
  constructor(props) {
    super(props)
  }
  render() {
    return <h1>hello {this.props.user}, {this.props.age}</h1>
  }
}

ReactDOM.render(<Greeting userName="react" />, document.getElementById('root'))