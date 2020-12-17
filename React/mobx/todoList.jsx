import {trace, toJS, spy, observe, observable, action, computed} from 'mobx'
import React, {Component, Fragment} from 'react'
import ReactDOM from 'react-dom'
import {observer, PropTypes as ObservablePropTypes} from 'mobx-react'
import PropTypes from 'prop-types'

spy(event => {
  console.log(event)
})

class Todo {
  constructor(title) {
    this.title = title
  }
  id = Math.random()
  @observable title = ''
  @observable finished = false

  @action.bound toggle() {
    this.finished = !this.finished
  }
}

class Store {
  disposers = []
  constructor() {
    observe(this.todos, change => {
      this.disposers.forEach(disposer = disposer())
      this.disposers = []
      for (let todo of change.object) {
        const disposer = observe(todo, changex => {
          this.save()
        })
        this.disposers.push(disposer)
      }
      this.save()
    })
  }
  save() {
    localStorage.setItem('todos', JSON.stringify(toJS(this.todos)))
  }
  @observable todos = []
  @action.bound createTodo(title) {
    this.todos.unshift(new Todo(title))
  }
  @action.bound removeTodo(todo) {
    this.todos.remove(todo)
  }
  @computed get left() {
    return this.todos.filter(todo => !todo.finished).length
  }
}

const store = new Store()

@observable
class TodoList extends Component {
  static propTypes = {
    store: PropTypes.shape({
      todos: ObservablePropTypes.observableArrayOf(
          ObservablePropTypes.observableObject
        ).isRequired,
      createTodo: PropTypes.func
    }).isRequired
  }
  state = {inputValue: ''}

  handleSubmit = (event) => {
    event.preventDefault()
    const {createTodo} = this.props.store
    const {inputValue} = this.state
    createTodo(inputValue)
    this.setState({inputValue: ''})

  }
  handleChange = event => {
    const inputValue = event.target.value
    this.setState({inputValue})
  }
  render() {
    const {left, todos, removeTodo} = this.props.store
    return (
      <div className="todo-list">
        <header>
          <form onSubmit={this.handleSubmit}>
            <input 
              type="text" 
              onChange={this.handleChange} 
              value={this.state.inputValue}
              className="input"
              placeholder="What needs to be"
            />
          </form>
        </header>
        <ul>
          {todos.map(
            todo => (
              <li className="todo-item" key={todo.id}>
                <TodoItem todo={todo} />
                <span
                  className="delete"
                  onClick={() => removeTodo(todo)}
                >X</span>
              </li>
            )
          )}
        </ul>
        <footer>{left}</footer>
      </div>
    )
  }
}

@observable
class TodoItem extends Component {
  static propTypes = {
    todo: PropTypes.shape({
      id: PropTypes.number.isRequired,
      title: PropTypes.string.isRequired,
      finished: PropTypes.bool.isRequired
    }).isRequired
  }
  handleClick = () => {
    this.props.toto.toggle()
  }
  render() {
    const {todo} = this.props
    return (
      <Fragment>
        <input
          type="checkbox"
          className="toggle"
          checked={todo.finished}
          onClick={this.handleClick}
        />
        <span 
          className={['title', todo.finished && 'finished'].join(' ')}
        >
          {todo.title}
        </span>
      </Fragment>
    )
  }
}

ReactDOM.render(<TodoList store={store} />, document.querySelector('#root'))
