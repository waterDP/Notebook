/**
 * auth 指令 v-auth="String|Array"
 * 传入的权限码可以是数组或者字符串、
 * 此外还有两个修饰符 some 和every
 * v-auth.some="Array" 表示满足其中一个资源即可（不设置修饰符的情况下默认为some）
 * v-auth.every="Array" 表示列表的所有资源必须存在
 * 调用实例
 *   <button v-auth.some="['admin1', 'admin2']"></button>
 *   <button v-auth.every=['admin1', 'admin2']"></button>
 *   <button v-auth="'admin1"></button>
 */
const remove = el => el.parentNode.removeChild(el)

const auth = {
  inserted(el, binding, vnode) {
    const {$root: vm} = vnode.context
    const permissions = vm.$store.state.auth.permissions
    if (_.isArray(permissions) && permissions.length) {
      const {value, modifiers} = binding
      
      if (_.isString(value) || _.isArray(value)) {
        const perms = _.isString(value) ? [value] : value
        if (modifiers.every) {
          perms.every(v => permissions.includes(v)) || remove(el)
        } else {
          perms.some(v => permissions.includes(v)) || remove(el)
        }
      }
    }
  }
}

const install = Vue => {
  Vue.directive('auth', auth)
}

export default {
  install
}