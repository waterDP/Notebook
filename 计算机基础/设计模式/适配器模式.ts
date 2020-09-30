interface HuaWeiInterface { 
  listenMusic(): void
}
class HuaWeiInterfaceImpl implements HuaWeiInterface { 
  listenMusic() { 
    console.log('默认接口')
  }
}
interface commonInterface { 
  listenMusic(): void
}
class commonInterfaceImpl implements commonInterface {
  listenMusic() {
    console.log('通用接口')
  }
}
class UsbInterface implements HuaWeiInterface { 
  private commonInterface: commonInterface
  constructor(commonInterface: commonInterface) { 
    this.commonInterface = commonInterface
  }
  listenMusic() {
    console.log('usb接口')
    this.commonInterface.listenMusic()
  }
}
let huawei = new commonInterfaceImpl()
let usbAdepter = new UsbInterface(huawei)
usbAdepter.listenMusic()
