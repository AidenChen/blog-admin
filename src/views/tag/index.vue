<template>
  <div class="tag">
    <router-view />
  </div>
</template>

<script lang="ts" setup>
defineOptions({
  // eslint-disable-next-line vue/multi-word-component-names
  name: 'Tag'
});
</script>

<style lang="scss" scoped>
.tag {
  height: 100%;
}
</style>
