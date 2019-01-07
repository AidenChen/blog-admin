<template>
  <div class="dashboard">
    <el-container style="height: 100%;">
      <el-aside width="240px">
        <el-menu :default-openeds="['content']" style="height: 100%;">
          <el-submenu index="content">
            <template slot="title">
              <i class="el-icon-menu"></i>内容管理
            </template>
            <el-menu-item index="post" @click="goToView('posts')">文章管理</el-menu-item>
            <el-menu-item index="tag" @click="goToView('tags')">标签管理</el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>

      <el-container style="display: block;">
        <el-header>
          <div class="admin__logout">
            <i class="fa fa-power-off" aria-hidden="true" @click="logout" />
          </div>
        </el-header>

        <el-main>
          <router-view/>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';

export default {
  name: 'dashboard',
  computed: {
    ...mapGetters(['token']),
  },
  mounted() {
    if (!this.token) {
      this.$router.push('/login');
    }
  },
  methods: {
    ...mapMutations({
      deleteToken: 'DELETE_TOKEN',
    }),
    logout() {
      this.$messageBox
        .confirm('此操作将退出系统, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        })
        .then(() => {
          this.deleteToken();
          this.$router.push('/login');
        })
        .catch(() => {});
    },
    goToView(path) {
      this.$router.push(`/dashboard/${path}`);
    },
  },
};
</script>

<style lang="scss">
.dashboard {
  height: 100%;

  .el-header {
    padding: 0;
    background-color: #b3c0d1;
    line-height: 64px;
    height: 64px !important;
  }

  .admin__logout {
    position: absolute;
    right: 30px;
    font-size: 28px;
    cursor: pointer;
    color: #0288d1;
  }

  .el-main {
    padding: 0;
  }
}
</style>
