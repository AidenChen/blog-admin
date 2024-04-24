<template>
  <div class="login">
    <el-form class="form" :model="form">
      <el-form-item>
        <el-input v-model="form.username"></el-input>
      </el-form-item>
      <el-form-item>
        <el-input type="password" v-model="form.password" autocomplete="off" @keyup.enter="handleLogin"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleLogin">登录</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

defineOptions({
  // eslint-disable-next-line vue/multi-word-component-names
  name: 'Login'
});

const router = useRouter();
const authStore = useAuthStore();

const form = ref<any>({});

const handleLogin = () => {
  authStore.login(form.value).then(() => {
    router.push({ path: '/' });
  });
};
</script>

<style lang="scss" scoped>
.login {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;

  .form {
    width: 460px;
    height: 200px;

    .el-button {
      width: 100%;
    }
  }
}
</style>
