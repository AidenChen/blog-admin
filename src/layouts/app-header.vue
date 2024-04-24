<template>
  <div class="header">
    <div class="hamburger-wrapper" @click="handleUpdateCollapse">
      <svg class="hamburger" :class="{ 'is-active': !isCollapse }" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" width="20" height="20">
        <path
          d="M408 442h480c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8H408c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8zm-8 204c0 4.4 3.6 8 8 8h480c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8H408c-4.4 0-8 3.6-8 8v56zm504-486H120c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h784c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zm0 632H120c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h784c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zM142.4 642.1L298.7 519a8.84 8.84 0 0 0 0-13.9L142.4 381.9c-5.8-4.6-14.4-.5-14.4 6.9v246.3a8.9 8.9 0 0 0 14.4 7z"
        />
      </svg>
    </div>
    <div class="logout" @click="handleLogout">退出登录</div>
  </div>
</template>

<script lang="ts" setup>
import { useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import { useAuthStore } from '@/stores/auth';
import { useAppStore } from '@/stores/app';

defineOptions({
  name: 'AppHeader'
});

const router = useRouter();
const authStore = useAuthStore();
const appStore = useAppStore();
const { isCollapse } = storeToRefs(appStore);

const handleUpdateCollapse = () => {
  appStore.updateCollapse(!isCollapse.value);
};

const handleLogout = () => {
  authStore.logout().then(() => {
    router.push({ path: '/login' });
  });
};
</script>

<style lang="scss">
$header-height: 60px;

.header {
  height: $header-height;
  border-bottom: 1px solid #d8dce5;
  box-shadow:
    0 1px 3px 0 rgba(0, 0, 0, 0.12),
    0 0 3px 0 rgba(0, 0, 0, 0.04);

  .hamburger-wrapper {
    display: inline-block;
    box-sizing: border-box;
    width: $header-height;
    height: $header-height;
    padding: 20px;
    vertical-align: middle;
    cursor: pointer;

    .hamburger {
      &.is-active {
        transform: rotate(180deg);
      }
    }
  }

  .logout {
    display: inline-block;
    width: $header-height;
    height: $header-height;
    line-height: $header-height;
    text-align: center;
    font-size: 14px;
    cursor: pointer;
  }
}
</style>
