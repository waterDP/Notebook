abstract class AbstractObject {
  protected abstract operation(): void
}
class RealObject extends AbstractObject {
  operation() {
    console.log('operation...')
  }
}
class ProxyObject extends AbstractObject { 
  private realObject: RealObject | null = null
  constructor(obj: RealObject) {
    super()
    this.realObject = obj
  }
  operation() {
    console.log('before realObject operation...')
    if (this.realObject === null) {
      this.realObject = new RealObject()
    }
    this.realObject.operation()
    console.log('after realObject operation...')
  }
}
let realObj = new RealObject()
let proxyObj = new ProxyObject(realObj)
proxyObj.operation()