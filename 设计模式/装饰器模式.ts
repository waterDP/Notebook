interface HuaWei { 
  getMemory(): string
  getPrice(): number
}
class HuaWeiPro30 implements HuaWei {
  getMemory() {
    return '16G'
  }
  getPrice() {
    return 6888
  }
}
class HuaWeiPro40 implements HuaWei { 
  getMemory() {
    return '16G'
  }
  getPrice() {
    return 8888
  }
}
abstract class ScreenHuaWei implements HuaWei { 
  abstract huawei: HuaWei
  abstract getScreen(): number
  getPhone() {
    return this.huawei
  }
  setPhone(phone: HuaWei) {
    this.huawei = phone
  }
  getMemory() { 
    return this.huawei.getMemory()
  }
  getPrice() {
    return this.huawei.getPrice()
  }
}

class AddScreen extends ScreenHuaWei { 
  huawei: HuaWei
  constructor(phone: HuaWei) {
    super()
    this.huawei = phone
  }
  getScreen() {
    return 5.5
  }
}

let phoneWithoutScreen = new HuaWeiPro40()
let phoneScreen5 = new AddScreen(phoneWithoutScreen)
console.log(phoneScreen5.getScreen())

