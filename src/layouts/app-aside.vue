<template>
  <div class="aside">
    <el-menu :router="true" :show-timeout="200" :default-active="$route.path" :collapse="isCollapse" background-color="#304156" text-color="#bfcbd9" active-text-color="#409EFF">
      <el-sub-menu index="/">
        <template #title>
          <i class="el-icon-menu"></i>
          <span>内容管理</span>
        </template>
        <el-menu-item index="/posts">文章管理</el-menu-item>
        <el-menu-item index="/tags">标签管理</el-menu-item>
      </el-sub-menu>
    </el-menu>
  </div>
</template>

<script lang="ts" setup>
import { storeToRefs } from 'pinia';
import { useAppStore } from '@/stores/app';

defineOptions({
  name: 'AppAside'
});

const appStore = useAppStore();
const { isCollapse } = storeToRefs(appStore);
</script>

<style lang="scss" scoped>
.aside {
  height: 100%;

  & > .el-menu {
    border-right: none;
    height: 100%;
    min-height: 400px;
    width: 200px;

    &.el-menu--collapse {
      width: 64px;
    }
  }
}
</style>
