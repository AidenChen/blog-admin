import { ref } from 'vue';
import { defineStore } from 'pinia';
import StorageService from '@/services/storage';
import api from '@/api';

export const useAuthStore = defineStore('auth', () => {
  const user = ref<any>(StorageService.get('user', {}));
  const token = ref<string>(StorageService.get('token', ''));

  function login(data) {
    return new Promise((resolve) => {
      api.auth
        .login(data)
        .then((res) => {
          user.value = res.data.data;
          StorageService.set('user', user.value);
          token.value = res.headers['authorization'];
          StorageService.set('token', token.value);
          resolve(undefined);
        })
        .catch(() => {});
    });
  }

  function logout() {
    return new Promise((resolve) => {
      user.value = {};
      StorageService.set('user', user.value);
      token.value = '';
      StorageService.set('token', token.value);
      resolve(undefined);
    });
  }

  return { user, token, login, logout };
});
