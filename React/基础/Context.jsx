/**
 * todo: 何时使用Context 
 * Context 设计目的是为了共享那些对于一个组件树而言是“全局”的数据，例如当前谁的用户、 主题或首选语言。
 * 举个例子，在面的代码中，我们通过一个theme属性手动调整一个按钮组件的样式
 */
import React from "react"
class App extends React.Component {
  render() {
    return (
      <Toolbar theme="dark" /> 
    )
  }
}
function Toolbar(props) {
  // Toolbar组件接受一个额外的theme属性，然后传递给ThemeButton组件
  // 如果应用中每一个单独的按钮都需要知道theme的值，这会是件很麻烦的事
  // 因为必须将这个值层层传递所有组件
  return (
    <div>
      <ThemeButton theme={props.theme} />
    </div>
  )
}
class ThemeButton extends React.Component {
  render() {
    return <Button theme={this.props.theme} />
  }
}

// 使用context，我们可以避免通过中间元素传递props
// context可以让我们无须明克的传遍每一个组件，就能将值深入传递时组件树
// 为当前的theme创建一个context light为默认值

const ThemeContext = React.createContext('light')

class App extends React.Component {
  render() {
    // 使用一个Provider来将当前的theme传递给以下的组件树
    // 无论多深，任何组件都能读取这个值
    // 在这个例子中，我们将"dark"作为当前的值传递下去
    return (
      <ThemeContext.Provider value="dark">
        <Toolbar />
      </ThemeContext.Provider>
    )
  }
}

// 中间的组件再也不必指明往下传递theme了
function Toolbar() {
  return (
    <div>
      <ThemedButton />
    </div>
  )
}

class ThemedButton extends React.Component {
  // 指定contextType读取当前的theme context
  // React会往上找到时最近的theme Provider，然后使用它的值
  // 在这个例子中，当前的theme值为dark
  static contextType = ThemeContext
  render() {
    return <Button theme={this.context} />
  }
}

function Title(props) {
  return (
    <ThemeContext.Consumer>
      {  // todo 使用consumer
        value => (
          <div style={{margin: '10px', border: `5px solid ${value.color}`, padding:  '5px'}}>Title</div>
        )
      }
    </ThemeContext.Consumer>
  )
}