<template>
  <transition>
    <div v-show="visible">
      {{message}}
    </div>
  </transition>
</template>
<script>
export default {
  data() {
    return {
      message: '',
      type: '',
      visible: false,
      duration: 3000,
      timer: null
    }
  },
  mounted() {
    let vm = this;
    if (this.duration > 0) {
      this.timer = setTimeout(() => {
        vm.$destroy()  // 销毁当前实例
        vm.$el.parentNode.removeChild(this.$el) // 销毁dom元素
      }, this.duration);
    }
  }
}
</script>
<style>
  .v-enter {
    opacity: 0
  }
  .v-enter-active {
    transition: 1s linear
  }
  .v-enter-to {
    opacity: 1
  }
</style>