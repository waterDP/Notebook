<!--
 * @Description: 
 * @Date: 2021-03-03 17:04:16
 * @Author: water.li
-->
<template>
  <div>
    bar component
    {{$store.state.username}}
  </div>
</template>
<script>
export default {
  // 规定只有页面级组件才能使用
  asyncData({store}) { // 异步数据 这个方法只在服务端执行，客户端运行是不会运行的
    return store.dispatch('set_username')
  },
  mounted() {
    this.$store.dispatch('set_username')
  }
}
</script>