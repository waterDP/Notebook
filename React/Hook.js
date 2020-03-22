// todo 简介
import React, {useState} from "react"


// todo State Hook
function Example() {
  // 声明一个新的叫做'count'的state变量
  const [count, setCount] = useState(0)
  return (
    <div>
      <p>You Clicked {count} times</p>
      <button onClick={() => setCount(count+1)}></button>
    </div>
  )
}


// todo Effect Hook
import React, {useState, useEffect} from "react"
function Example1() {
  const [count, setCount] = useState(0)
  // 相当于componentDidMount 和 componentDidUpdate
  useEffect(() => {
    // 使用浏览器的API更新页面标题
    document.title = `You clicked ${count} times`
  })

  return (
    <>
      <div>You clicked {count} times</div>
      <button onClick={() => setCount(count+1)}>
        Click me
      </button>
    </>
  )
}

// todo 需要清除的effect
// class
class FriendStatus extends React.Component {
  constructor(props) {
    super(props)
    this.state = {isOnline: null}
  }
  componentDidMount() {
    ChatAPI.subscribeToFriendStatus(
      this.props.friend.id,
      this.handleStatusChange
    )
  }
  componentWillUnmount() {
    ChatAPI.unsubscribeFromFriendStatus(
      this.props.friend.id,
      this.handleStatusChange
    )
  }
  handleStatusChange(status) {
    this.setState({
      inOnline: status.isOnline
    })
  }
  render() {
    if (this.state.isOnline === null) {
      return 'Loading...'
    }
    return this.state.isOnline ? 'Online' : 'Offline'
  }
}

