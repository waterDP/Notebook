// todo 鼠标和指针事件 
class OuterClickExample extends React.Component {
  constructor(props) {
    super(props)

    this.state = {isOpen: false}
    this.toggleContainer = React.createRef()
  }

  componentDidMount() {
    window.addEventListener('click', this.onClickOutsideHandler)
  }

  componentWillUnmount() {
    window.removeEventListener('click', this.onClickOutsideHandler)
  }

  onClickHandler = () => {
    this.setState(currentState => ({
      isOpen: !currentState.isOpen
    }))
  }

  onClickOutsideHandler = event => {
    if (this.state.isOpen && !this.toggleContainer.current.contains(event.target)) {
      this.setState({isOpen: false})
    }
  }

  render() {
    return (
      <div ref={this.toggleContainer}>
        <button onClick={this.onClickHandler}></button>
        {this.state.isOpen && (
          <ul>
            <li>Option 1</li>
            <li>Option 2</li>
            <li>Option 3</li>
          </ul>
        )}
      </div>
    )
  }
}