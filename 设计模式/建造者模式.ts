/**
 * @description Product: 最终要生成的对象
 * @description Builder: 创建者的抽象基类基类（有时会使用接口代替）。其定义了构建Product的抽象步骤，其实体类需要实现
 *                       这些步骤。其中包含一个用来返回最终产品的方法Product getProduct()
 * @description ConcreteBuilder: Builder的实现类
 * @description Director: 决定如何构建最终产品的算法，其会包含一个负责组装的方法Constructor(Builder builder),
 *                        在这个方法中通过调用builder的方法，就可以设置builder，等设置完成后，就可以通过builder的
 *                        getProduct()方法获取最终的实例
 */
abstract class PhoneBuilder { 
  public abstract setBrand(): void
  public abstract setSystem(): void
  public abstract getPhone(): void
}
class Phone {
  private brand: string = ''
  private cpu: string = ''
  private screen: number = 0
  private system: string = ''
  constructor(cpu: string, screen: number) { 
    this.cpu = cpu
    this.screen = screen
  }
  setBrand(brand: string) {
    this.brand = brand
  }
  setCPU(cpu: string) {
    this.cpu = cpu
  }
  setScreen(screen: number) {
    this.screen = screen
  }
  setSystem(system: string) {
    this.system = system
  }
}
class Huawei extends PhoneBuilder { 
  private phone: Phone
  constructor(cpu: string, screen: number) {
    super()
    this.phone = new Phone(cpu, screen)
  }
  public setBrand() {
    this.phone.setBrand('huawei')
  }
  public setSystem() {
    this.phone.setSystem('hongmeng')
  }
  public getPhone() {
    return this.phone
  }
}
class PhoneDirector { 
  makeComputer(builder: PhoneBuilder) {
    builder.setBrand()
    builder.setSystem()
  }
}
let director = new PhoneDirector()
let builder = new Huawei('八核', 5.8)
director.makeComputer(builder)
let huawei = builder.getPhone()
// phone {brand: 'huawei', cpu: '八核', screen: 5.8, system: 'hongmeng'}