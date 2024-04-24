<template>
  <div class="post">
    <router-view />
  </div>
</template>

<script lang="ts" setup>
defineOptions({
  // eslint-disable-next-line vue/multi-word-component-names
  name: 'Post'
});
</script>

<style lang="scss" scoped>
.post {
  height: 100%;
}
</style>
