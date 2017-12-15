<template>
  <div class="admin">
    <div class="admin__list">
      <list></list>
    </div>
    <!-- <div class="admin__editor">
      <editor></editor>
    </div> -->
    <div class="admin__logout">
      <i class="fa fa-power-off" aria-hidden="true" @click="logout"></i>
    </div>
  </div>
</template>

<script>
import { mapMutations } from 'vuex';
// import Editor from './Editor.vue';
import List from './List';

export default {
  name: 'Admin',
  components: {
    // Editor,
    List
  },
  data() {
    return {};
  },
  created() {},
  methods: {
    ...mapMutations({
      deleteToken: 'DELETE_TOKEN'
    }),
    logout() {
      this.$messageBox.confirm('此操作将退出系统, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.deleteToken();
          this.$router.push('/login');
        })
        .catch(() => {});
    }
  },
  computed: {}
};
</script>

<style lang="scss">
.admin__list {
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  width: 500px;
  overflow-y: auto;
  overflow-x: hidden;
}

.admin__editor {
  margin-left: 500px;
}

.admin__logout {
  position: absolute;
  top: 22px;
  right: 30px;
  font-size: 28px;
  cursor: pointer;
  color: #0288d1;
}
</style>
