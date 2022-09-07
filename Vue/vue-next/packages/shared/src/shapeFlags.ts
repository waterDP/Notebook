/*
 * @Author: water.li
 * @Date: 2022-04-09 23:16:05
 * @Description: 
 * @FilePath: \note\Vue\vue-next\packages\shared\src\shapeFlags.ts
 */
export const enum ShapeFlags {
  ELEMENT = 1, // 元素
  FUNCTIONAL_COMPONENT = 1 << 1, // 函数式组件
  STATEFUL_COMPONENT = 1 << 2,  // 普能组件
  TEXT_CHILDREN = 1 << 3, // 孩子是文件
  ARRAY_CHILDREN = 1 << 4, // 孩子是数组
  SLOTS_CHILDREN = 1 << 5, // 组件插槽
  TELEPORT = 1 << 6, // teleport组件 
  SUSPENSE = 1 << 7, // suspese组件
  COMPONENT_SHOULD_KEEP_ALIVE = 1 << 8,
  COMPONENT_KEPT_ALIVE = 1 << 9,
  COMPONENT = ShapeFlags.STATEFUL_COMPONENT | ShapeFlags.FUNCTIONAL_COMPONENT // 组件
}
  