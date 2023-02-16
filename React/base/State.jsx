import React from 'react'
import ReactDOM from "react-dom"

class Clock extends React.Component {
  state = {
    date: new Date().toLocaleTimeString()
  }
  // 给类的实例增加一个add属性，而这个属性里的this绑死为组件的实例\\
  // 这个方法是直接赋给实例，而不是放在原型上的 
  add = () => {
    this.setState()
  }
  // 组件挂载完成后调用
  componentDidMount() {
    this.$timer = setInterval(() => {
      // setState 1.修改状态 2.重新render
      this.setState({date: new Date().toLocaleTimeString()})

      // 强制更新
      this.state.number = this.state.number + 1
      this.forceUpdate()
    }, 1000)

    // 异步更新的方法
    this.setState((state) => ({number: state.number+1}))
    this.setState((state) => ({number: state.number+1}))
  }
  render() {
    return <div>时间：{this.state.date}</div>
  }
}

ReactDOM.render(<Clock />, document.getElementById('root')


/**
 * ! setState只在合成事件和钩子函数中是"异步"的，在原生事件和 setTimeout中都是同步的
 */
