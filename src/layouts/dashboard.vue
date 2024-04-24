<template>
  <div class="dashboard">
    <el-container>
      <el-aside width="inherit">
        <app-aside />
      </el-aside>
      <el-container>
        <el-header>
          <app-header />
        </el-header>
        <el-main>
          <router-view />
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script lang="ts" setup>
import AppHeader from './app-header.vue';
import AppAside from './app-aside.vue';

defineOptions({
  // eslint-disable-next-line vue/multi-word-component-names
  name: 'Dashboard'
});
</script>

<style lang="scss" scoped>
.dashboard {
  height: 100%;

  & > .el-container {
    height: 100%;
  }
}
</style>
