<template>
  <div id="app">
    <router-link to="/home">首页</router-link>
    <router-link to="/about">关于</router-link>
    <router-view/>
  </div>
</template>

<script>

export default {
  name: 'App'
}
</script>

<style>
#app {
  padding: 20px;
}
#app a {
  text-decoration: none;
  color: #fff;
  background-color: #2ab561;
  margin-right: 10px;
}
</style>
