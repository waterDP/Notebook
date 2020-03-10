export function vnode(tag, props, key, children, text) {
  return {
    tag,  // 表示的是当前的标签名
    props,  // 表示的是当前标签上的属性
    key, // 唯一表示用户可能的传递
    children, 
    text
  }
}