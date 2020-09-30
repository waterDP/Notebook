class Subject { 
  private state: number
  private observers: Array<Observer>
  constructor() {
    this.state = 0
    this.observers = []
  }
  getState() { 
    return this.state
  }
  setState(state: number) {
    this.state = state
    this.notifyAllObservers()
  }
  notifyAllObservers() { 
    this.observers.forEach(observer => observer.update())
  }
  attach(observer: Observer) {
    this.observers.push(observer)
  }
}

class Observer { 
  name: string
  subject: Subject
  constructor(name: string, subject: Subject) {
    this.name = name
    this.subject = subject
    this.subject.attach(this) // 把观察者添加主题中观察者列表上来
  }
  update() {
    console.log(`${this.name} update, state: ${this.subject.getState()}`)
  }
}

let sub = new Subject()
let obs1 = new Observer('obs1', sub)
let obs2 = new Observer('obs2', sub)
let obs3 = new Observer('obs3', sub)
sub.setState(1)
sub.setState(2)
sub.setState(3)
