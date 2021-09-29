abstract class State { 
  protected context: Context | undefined
  setContext(context: Context): void { 
    this.context = context
  }
  public abstract handle1(): void
}

class ConcreteState1 extends State { 
  handle1() { 
    // ...
    console.log('ConcreteState1的handle1方法')
  }
}

class Context { 
  static STATE1: State = new ConcreteState1()
  currentState: State | undefined
  getCurrentState(): State | undefined {
    return this.currentState
  }
  setCurrentState(currentState: State) {
    this.currentState = currentState
    this.currentState.setContext(this)
  }
  handle1(): void {
    this.currentState && this.currentState.handle1()
  }
}

let context = new Context()
context.setCurrentState(new ConcreteState1())
context.handle1()