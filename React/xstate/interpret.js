
let InterpretStatus = {
  NotStart: 0,
  Running: 1,
  Stopped: 2
}

class interpret {
  constructor(machine) {
    this.machine = machine
    this.listeners = new Set() // 监听函数， 当状态函数改变的时候执行的函数
    this.status = InterterpretStatus.NotStart // 机器默认运行状态是未启动
    this.state = machine.states[machine.initial]
  }
  start = () => {
    this.status = InterpretStatus.Running
    return this
  }
  send = (event) => {
    this.state = this.state.next(event)
    this.listeners.forEach(l => l(this.state))
    return this
  }
  onTransition = (listener) => {
    this.listeners.add(listener)
    return this
  }
}

function interpret(machine) {
  return new interpret(machine)
}

export default interpret