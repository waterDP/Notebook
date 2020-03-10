import auth from "auth"
import drag from "drag"

const install = Vue => {
  Vue.directive('auth', auth)
  Vue.directive('drag', drag)
}

export default install