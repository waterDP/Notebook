/**
 * ^ 享元模式
 * 运用共享技术，有效地支持大量的细粒度的对象，以避免对象之间拥有相同内容而造成多余的性能开销
 * 享元模式将对象的属性区分为内部状态与外部状态，内部状态在创建的时候赋值，
 * 外部状态在实际需要用到的时候进行赋值
 *
 * 对于内部状态和外部状态的区分
 * 1.内部状态存储于对象内部
 * 2.内部状态可以被一些对象共享
 * 3.内部状态独立于具体场景，通常不会改变
 * 4.外部状态取决于具体场景，并根据场景变化，外部状态不能共享
 */

// todo 我们要创建100个大小相同颜色不同的div
/**
 * * 不使用享元模式的做法是
 * 1.创建一个创建div的类 CreateDiv
 * 2.new CreateDiv()创建div
 * 3.我们需要100次，这样就造成了很大的空间浪费
 */
interface Divo {
  width: number;
  height: number;
  color: string;
}
const divStoreo: Divo[] = [];

class createDiv implements Divo {
  public width = 100;
  public height = 100;
  public color = this.randomColor();
  private randomColor() {
    const colors = ["red", "green", "blue", "white", "black"];
    return colors[Math.floor(Math.random() * colors.length)];
  }
}
let count = 100;
while (count--) {
  const innerDiv = new createDiv();
  divStoreo.push(innerDiv);
}

/**
 * * 享元模式实现
 */
interface Div {
  outer: {
    width: number;
    height: number;
  };
  innter: {
    color: string;
  };
}
const divStore: Div[] = [];

class CreateOuterDiv {
  width: number = 100;
  height: number = 100;
}

class CreateInnterDiv {
  color: string = this.randomColor();
  private randomColor() {
    const colors = ["red", "green", "blue", "white", "black"];
    return colors[Math.floor(Math.random() * colors.length)];
  }
}

// 创建外部div
const outerDiv = new CreateOuterDiv();
let innerDiv;
let count1 = 100;
while (count1--) {
  innerDiv = new CreateInnterDiv();
  divStore.push({
    outer: outerDiv,
    inter: innerDiv,
  });
}
