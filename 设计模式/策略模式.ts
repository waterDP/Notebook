/*
 * @Author: water.li
 * @Date: 2022-04-16 20:38:06
 * @Description: 
 * @FilePath: \note\设计模式\策略模式.ts
 */
/**
 * @description Context: 用来操作策略的上下文环境
 * @description Strategic: 策略的抽象
 * @description ConcreteStrategicA, ConcreteStrategicB 具体策略实现
 */
interface CalcStrategic {
  calcPrice(km: number): number
}
class LevelOneCar implements CalcStrategic { 
  baseMoney: number = 6
  calcPrice(km: number) { 
    if (km < 3) {
      return this.baseMoney
    }
    return this.baseMoney + (km - 3) * 2
  }
}
class LevelTwoCar implements CalcStrategic { 
  baseMoney: number = 10
  calcPrice(km: number) {
    if (km < 3) {
      return this.baseMoney
    }
    return this.baseMoney + (km - 2) * 4
  }
}
class TransStrategy { 
  private carOne: CalcStrategic = new LevelOneCar()
  setStrategy(strategy: CalcStrategic) { 
    this.carOne = strategy
  }
  calc(km: number): number {
    return this.carOne.calcPrice(km)
  }
}

let tranStrategy = new TransStrategy()
console.log(tranStrategy.calc(5)) // 10

// 虚拟代理 把一些开销很大的对象，延迟到真正需要它的时候再去创建它
function myImageFun() {
  let imgNode = document.createElement('img')
  document.body.append(imgNode)
  return {
    setSrc(src) {
      imgNode.src = src
    }
  }
}
let imgSlot = myImageFun()

let proxyImgFun = () => {
  let img = new Image()
  img.onload = function() {
    imgSlot.setSrc((<any>this).src)
  }
  return {
    setSrc(src) {
      imgSlot.setSrc('小的默认图片')
      img.src = src
    }
  }
}
let proxyImg = proxyImgFun()
proxyImg.setSrc('http://sehnfgiur.mvieq/veni/di3uq.43940.jpg')