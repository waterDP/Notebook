export function createContext() {
  function Provider(props) {
    Provider.value = props.value
    return props.children  // 直接渲染儿子
  }
  function Consumer(props) {
    let children = Array.isArray(props.children) ? props.children[0] : props.children
    return children(Provider.value)
  }

  return {
    Provider,
    Consumer
  }
}
