import React, { Component } from 'react';
import ReactDOM from 'react-dom'

class MouseTracker extends Component {
  constructor(props) {
    super(props)
    this.state = { x: 0, y: 0 }
  }
  handleMouseMove = (event) => {
    this.setState({
      x: event.clientX,
      y: event.clientY
    })
  }
  render() {
    return (
      <div onMouseMove={this.handleMouseMove}>
        {this.props.render({x: this.state.x, y: this.state.y})}
      </div>
    )
  }
}

function Picture(props) {
  return (
    <div>
      <img src="http://localhost: 3000/bg.jpg" />  
      <p>当前鼠标的位置是</p>
    </div>
  )
}

ReactDOM.render(<MouseTracker render={(props)=><Picture {...props}/>} />)