/** 
 * ! customRef 
 * customRef 用于定义一个ref,可以显式地控制依赖追踪和触发响应，接受一个工厂函数，两个参数分别用来追踪的
 * track与用于触发响应的trigger，并返回一个带有get和set 属性的对象
 */

function useDebouncedRef(value, delay = 200) { 
  let timeout
  return customRef((track, trigger) => { 
    return {
      get() {
        track()
        return value
      },
      set(val) { 
        clearTimeout(timeout)
        timeout = setTimeout(() => { 
          value = val
          trigger()
        }, delay)
      }
    }
  })
}

export default {
  setup() { 
    return {
      text: useDebouncedRef('hello')
    }
  }
}

function customRef<T>(factory: CustomRefFactory<T>): Ref<T>

type CustomRefFactory<T> = (
  track: () => void,
  trigger: () => void
) => {
  get: () => T,
  set: (value: T) => void
}