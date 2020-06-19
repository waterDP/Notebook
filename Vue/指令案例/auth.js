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

export default {
  inserted(el, binding, vnode) {
    const {$root: vm} = vnode.context
    // 获取当前用户拥有的权限列表（根据自身业务获取）
    const accessAuthData = vm.$store.state.accessAuthData
    // 判断非所有权限时进行权限校验
    if (accessAuthData !== '*') {
      let {value, modifiers} = binding
      // 判断是否为字符串或数组类型
      if (!(_.isString(value)) || _.isArray(value)) {
        remove(el)
        return console.error('please set the value to a string or array.')
      }

      // 非数组时设置为数组
      if (_.isString(value)) {
        value = [value]
      }

      /**
       * 判断条件
       * -修饰符为every时 value数组只要有一个元素不存在accessAuthData权限集中，隐藏元素
       * -修饰符为some或者没有时，value数组所有元素都不存在accessAuth权限集内，隐藏元素
       */
      if ((modifiers.every && (value.some(v => !accessAuthData.includes(v)))) ||
        (!modifiers.every && (value.every(v => !accessAuthData.includes(v))))) {
          remove(el)
        }
    }
  }
}
