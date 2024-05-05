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
  font-family:
    -apple-system,
    BlinkMacSystemFont,
    Segoe UI,
    Roboto,
    Ubuntu,
    Helvetica Neue,
    Helvetica,
    Arial,
    PingFang SC,
    Microsoft YaHei UI,
    Microsoft YaHei,
    Source Han Sans CN,
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  height: 100%;
}
</style>
