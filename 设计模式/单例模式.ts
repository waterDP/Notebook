// todo 普通单例
class Singleton { 
  private static instance: Singleton = new Singleton()
  constructor() { }
  static getInstance(): Singleton { 
    return Singleton.instance
  }
}

const instance = Singleton.getInstance()
console.log(instance)

// todo 惰性单例
class Singleton1 {
  private static instance: Singleton1
  private constructor() { }
  static getInstance(): Singleton1 { 
    if (Singleton1.instance == null) {
      Singleton1.instance = new Singleton1()
    }
    return Singleton1.instance
  }
}

const instance1 = Singleton1.getInstance()
console.log(instance1)

// todo 闭包实现
const CustomClass = function () { }
const Singleton3 = (function () { 
  let instance = null
  return function (): void {
    if (!instance) {
      instance = new CustomClass()
    }
    return instance
  }
})()

let sing = new Singleton3()
let sing2 =  new Singleton3()

// todo 实现单一Message
class EleMessage { 
  private static instance: EleMessage | null = null
  private constructor() { }
  close() {
    EleMessage.instance = null
  }
  show(msg: string | void) {
    if (EleMessage.instance instanceof EleMessage) {
      EleMessage.instance.close()
    }
    // 显示message
    EleMessage.getMessage()
  }
  static getMessage(msg: string | void) {
    if (EleMessage.instance == null) {
      EleMessage.instance = new EleMessage()
    }
    return EleMessage.instance
  }
}
const Message = EleMessage.getMessage()
Message.show('123')
