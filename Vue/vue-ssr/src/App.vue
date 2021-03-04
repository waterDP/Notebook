<!--
 * @Description: 
 * @Date: 2021-03-03 17:03:58
 * @Author: water.li
-->
<template>
  <div id="app">
    <router-link to="/">bar</router-link>
    <router-link to="/foo">foo</router-link>
    <router-view></router-view>
  </div>
</template>
<script>
import Bar from './components/Bar'
import Foo from './components/Foo'
export default {
  components: {
    Bar,
    Foo
  }
}
</script>