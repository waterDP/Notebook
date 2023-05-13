/*
 * @Description:
 * @Date: 2021-04-26 11:03:57
 * @Author: water.li
 */

/**
 * todo 生命周期
 * beforeCreate >> use setup()
 * created >> use setup()
 * beforeMount >> onBeforeMount
 * mounted >> onMounted
 * beforeUpdate >> onBeforeUpdate
 * updated >> onUpdated
 * beforeDestroy >> onBeforeUnmount
 * destroyed >> onUnmounted
 * onErrorCaptured  异常行为的捕获
 */

// toRef toRefs 解构

// unref

/**
 * ! setup
 * setup()函数是vue3中专门新增的方法，可以理解为Composition Api的入口
 * 在beforeCreate之后，create之前执行
 *
 * setup()的第二个参数是一个上下文对象，这个上下文对象大致包含了这些属性
 */
defineComponent({
  props: {
    msg: {
      type: String,
      default: "",
    },
  },
  setup(props, context) {
    context.attrs;
    context.slots;
    context.emit;
  },
});

/**
 * ! reactive
 * reactive 是用来创建一个响应式对象
 * 等价于2.x是Vue.observable
 */
import { reactive } from "vue";
defineComponent({
  setup(props, context) {
    const state = reactive({
      // 创建响应式数据
      count: 0,
      addCount: 0,
    });
    function increment() {
      state.count++;
      state.addCount = state.count * 2;
    }
    return {
      state,
      increment,
    };
  },
});

/**
 * ! ref
 * ref()函数用来给特定的值创建一个响应式的数据对象.ref()的返回值是一个对象，这个对象上只包含一个.value属性，下面是基本数据类型步骤
 */
import { ref, defineComponent } from "vue";
defineComponent({
  setup() {
    const valueNumber = ref(0);
    const valueString = ref("hello world");
    const valueBoolean = ref(true);
    const valueNull = ref(null);
    const valueUndefined = ref(null);

    return {
      valueNumber,
      valueString,
      valueBoolean,
      valueNull,
      valueUndefined,
    };
  },
});

// ! 只读的计算属性
import { ref, computed } from "vue";
defineComponent({
  setup() {
    const count = ref(0);
    const double = computed(() => count.value + 1);

    return {
      count,
      double,
    };
  },
});

// ! 可读写的计算属性
const count = ref(1);

const plusOne = computed({
  get: () => count.value + 1,
  set: (val) => (count.value = val - 1),
});

// ! watch
import { ref, watch } from "vue";
defineComponent({
  setup() {
    const count = ref(1);

    watch(count, (newVal, prevVal) => {
      console.log(count.value, "value");
    });

    return {
      count,
    };
  },
});

// 监听reactive的数据变化
defineComponent({
  setup() {
    const state = reactive({
      count: 0,
    });
    watch(
      () => state.count,
      (newVal, prevVal) => {}
    );
  },
});

/**
 * * watch watchEffect
 * watchEffect 不需要指定监听属性，可以自动收集依赖，只要我们回调中引用了响应式属性，那么这些属性的变更的时候，
 * 这个回调都会执行，而watch只能监听指定的属性而做出变更
 * watch可以获取得新值和旧值，而watchEffect获取不到
 * watchEffect 会在组件初始化的时候执行一次，与computed同理，而收集到依赖变化后，这个回调才会执行
 * 而watch不需要，除非设置了指定参数
 */
import { effect, ref } from "vue";
defineComponent({
  setup() {
    const userID = ref(0);
    const userPlus = ref(1);
    effect(() => {
      userPlus.value = userID.value + 1;
    });

    return {
      userID,
    };
  },
});

/**
 * ! shallowReactive
 * 只处理对象最外层属性的响应式（也就是浅响应式），所以最外层属性发生改变，更新视图
 * 其它属性改变，视图不会更新
 * 如果一个对象的数据结构比较深，但变化只是最外层属性
 */
import { shallowReactive } from "vue";

defineComponent({
  setup() {
    const obj = {
      a: 1,
      first: {
        b: 2,
        second: {
          c: 3,
        },
      },
    };

    const state = shallowReactive(obj);

    function change1() {
      state.a = 7;
    }
    function change2() {
      state.first.b = 8;
      state.first.second.c = 9;
      console.log(state);
    }

    return {
      state,
    };
  },
});

/**
 * ! customRef
 * 创建一个自定义的ref,并对其依赖和更新触发显式控制
 * 场景：使用customRef 实例输入框防抖
 */
import { customRef } from "vue";

defineComponent({
  setup() {
    const keyword = useDebouncedRef("", 500);
    return {
      keyword,
    };
  },
});

// todo 实现防抖
function useDebouncedRef(value, delay = 200) {
  let timeout;
  return customRef((track, trigger) => {
    return {
      get() {
        // 告诉vue追踪数据
        track();
        return value;
      },
      set(newVal) {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
          value = newVal;
          // 告诉vue去触发界面更新
          trigger();
        }, delay);
      },
    };
  });
}

// todo 自定义 Hook 函数
import { ref, onMounted, onUnmounted } from "vue";

export function useMousePosition() {
  const x = ref(-1);
  const y = ref(-1);

  const updatePosition = (e) => {
    x.value = e.pageX;
    y.value = e.pageY;
  };

  onMounted(() => {
    document.addEventListener("click", updatePosition);
  });

  onUnmounted(() => {
    document.removeEventListener("click", updatePosition);
  });

  return { x, y };
}

// 使用
<template>
  <div>
    <p>{{ x }}</p>
    <p>{{ y }}</p>
  </div>
</template>;

defineComponent({
  setup() {
    const { x, y } = useMousePosition();
    return { x, y };
  },
});

/**
 * todo context
 * toRefs可以保持数据的响应式
 */
import { toRefs } from "vue";
export default {
  setup(props, context) {
    const { name, age } = toRefs(props);
    const { attrs, slots, emit } = context;
  },
};
