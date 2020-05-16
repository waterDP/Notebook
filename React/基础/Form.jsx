class NameForm extends React.Component {
  constructor(props) {
    super(props)
    this.state = {value: ''}
  }

  handleChange = event => {
    this.setState({value: event.target.value})
  }

  handleSubmit = event => {
    alert('你的名字是：' + this.state.value)
    event.preventDefault()
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label>
          名字：
          <input type="text" value={this.state.value} onChange={this.handleChange} />
        </label>
        <input type="submit" value="提交" />
      </form>
    )
  }
}

// 处理多个输入 
class Reservation extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      isGoing: true,
      numberOfGuests: 2
    }
  }
  
  handleChange = event => {
    const target = event.target
    const value = target.name === 'isGoing' ? target.checked : target.value
    const name = target.name
    this.setState({
      [name]: value
    })
  }

  render() {
    return (
      <form>
        <label>
          参与：
          <input 
            type="checkbox"
            name="isGoing"
            checked={this.state.isGoing}
            onChange={this.handleChange}
          />
        </label>
        <br/>
        <label>
          来宾人数：
          <input 
            type="number"
            name="numberOfGuests" 
            value={this.state.numberOfGuests}
            onChange={this.handleChange}
          />
        </label>
      </form>
    )
  }
}