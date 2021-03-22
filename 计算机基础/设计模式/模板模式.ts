/*
 * @Description: 
 * @Date: 2021-03-22 10:00:45
 * @Author: water.li
 * 定义一个操作中的算法的骨架，而将一些步骤延迟到子类中。TemplateMethod使得子类可以不改变一个算法的结构即可重定义该算法的某些特定步骤
 */

class TemplateClass {
  private tm: AbstractClass
  constructor () {
    this.tm = new ConcreteClass()
    this.tm.TemplateMethod()
  }
}

abstract class AbstractClass {
  // 模板方法
  public TemplateMethod() {
    this.SpecificMethod()
    this.abstractMethod1()
    this.abstractMethod2()
  }

  // 具体方法
  public SpecificMethod() {
    console.log('....')
  }

  // 抽象方法
  public abstract abstractMethod1()

  public abstract abstractMethod2()
}

// 具体子类
class ConcreteClass extends AbstractClass {
  public abstractMethod1() {

  }
  public abstractMethod2() {

  }
}