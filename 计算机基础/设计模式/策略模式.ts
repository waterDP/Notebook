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