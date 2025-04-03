import { ref } from "vue";

export function useRef<T extends abstract new (...args: any) => any>(
  _component: T
) {
  return ref<InstanceType<T>>();
}
