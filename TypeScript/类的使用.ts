/*
 * @Author: water.li
 * @Date: 2023-01-04 22:15:27
 * @Description:
 * @FilePath: \Notebook\TypeScript\类的使用.ts
 */

// 用protected修饰类的构造函数  该类只能被继承 不能被实例化 即抽象类
class Animal {
  protected constructor(protected name: string) {}
}

class Dog extends Animal {
  constructor(public name: string) {
    super(name);
  }
}

// 也可以采用抽象类的写法来实现
abstract class Person {
  drink() {
    console.log("aaa");
  }
  abstract say: () => void; // ^ 实例上的方法
  abstract eat(): void; // ^ 原型上的方法
  // ! 抽象方法只能定义在抽象类中
}

class Teacher extends Person {
  public say: () => void;
  constructor() {
    super();
    this.say = () => {}; // todo 实现父类中的实例方法
  }
  eat(): void {}
}

// 用private修饰类的构造函数 该类只能被类自己实例 可以用来实现单例
class Singleton {
  static instance = new Singleton();
  private constructor() {}
}

export {};
