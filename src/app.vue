<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script lang="ts" setup>
defineOptions({
  name: 'App'
});
</script>

<style lang="scss" scoped>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  height: 100%;
}
</style>
