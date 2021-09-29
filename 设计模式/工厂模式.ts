/** 
 * @description 抽象工厂：提供了创建产品的接口，调用者通过它访问具体工厂的工厂方法来创建产品
 * @description 具体工厂：主要实现抽象工厂中的抽象方法，完成具体产品的创建
 * @description 抽象产品：定义了产品的规范，描述了产品的主要特性和功能
 * @description 具体产品：实现了抽象产品角色所定义的接口，由具体工厂来创建，它同具体工厂之间一一对应 
 */

interface Animal {
  show(): void
}
interface AnimalFarm { 
  newAnimal(): AnimalFarm
}

class DogFarm implements AnimalFarm { 
  newAnimal() { 
    console.log('new Dog degerate')
    return new DogFarm()
  }
}
class CatFarm implements AnimalFarm {
  newAnimal() {
    console.log('new cat degerate')
    return new CatFarm()
  }
}

class Dog extends DogFarm implements Animal { 
  show() { }
}
class Cat extends CatFarm implements Animal {
  show() { }
}

const dog = new Dog()
dog.newAnimal()