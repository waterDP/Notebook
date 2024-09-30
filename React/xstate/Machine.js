
function Machine(config) {
  return new StateNode(config)
}

class StateNode {
  constructor(config, machine, value) {
    this.config = config
    this.initial = config.initial
    this.value = value || config.initial
    this.machine = machine || this
    this.context = config.context || this.machine.context
    this.on = config.on // 遇到什么事件，变成什么状态在on里面定义

    let states = {}
    if (config.states) {
      for (let key of config.states) {
        states[key] = new StateNode(config.states[key], this.machine, key)
      }
    }
    this.states = states
  }
  next = (event) => {
    let { type } = event
    let nextState = this.on[type]
    if (typeof nextState === 'string') {
      return this.getStateNode(nextState)
    }
    let actions = nextState.actions
    if (Array.isArray(actions)) {
      let context = this.context
      let newContext = {}
      actions.forEach(action => {
        let assignment = action.assignment
        for (let key of assignment) {
          if (typeof assignment[key] === 'function') {
            newContext[key] = assignment[key](context, event)
          } else {
            newContext[key] = assignment[key]
          }
        }
      })
      Object.assign(context, newContext)
    }
    return this
  }
  getStateNode = (stateKey) => {
    return this.machine.states[stateKey]
  }
}

export default Machine