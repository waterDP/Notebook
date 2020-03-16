import auth from "auth"
import drag from "drag"
import dispatch from "dispatch"

const install = Vue => {
  Vue.directive('auth', auth)
  Vue.directive('drag', drag)
  Vue.directive('dispatch', dispatch)
}

export default install