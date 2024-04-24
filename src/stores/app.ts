import { ref } from 'vue';
import { defineStore } from 'pinia';

export const useAppStore = defineStore('app', () => {
  const isCollapse = ref<boolean>(false);

  function updateCollapse(val) {
    isCollapse.value = val;
  }

  return { isCollapse, updateCollapse };
});
