/*
 * @Author: water.li
 * @Date: 2025-04-03 22:36:17
 * @Description: ref自动推导出T的类型
 * @FilePath: \Notebook\Vue\hooks\useRef.ts
 */
import { ref } from "vue";

export function useRef<T extends abstract new (...args: any) => any>(
  _component: T
) {
  return ref<InstanceType<T>>();
}
