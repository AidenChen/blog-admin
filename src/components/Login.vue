<template>
  <div class="login">
    <div class="login__header">
      <h1 class="login__title">后台登录</h1>
    </div>
    <div class="login__item">
      <input type="text" placeholder="用户名" v-model="username">
    </div>
    <div class="login__item">
      <input type="password" placeholder="密码" v-model="password" @keyup.enter="login">
    </div>
    <div class="login__item">
      <button @click="login">登录</button>
    </div>
  </div>
</template>

<script>
import { mapMutations } from 'vuex';

export default {
  name: 'Login',
  data() {
    return {
      username: '',
      password: ''
    };
  },
  methods: {
    ...mapMutations({
      deleteToken: 'DELETE_TOKEN'
    }),
    login() {
      const info = {
        username: this.username,
        password: this.password
      };
      this.$store
        .dispatch('createToken', info)
        .then(() => {
          this.$message({
            message: '登录成功',
            type: 'success'
          });
          this.$router.push('/');
        })
        .catch(err => {
          this.$message.error(err.response.data.message);
          this.deleteToken();
        });
    }
  }
};
</script>

<style lang="scss">
.login {
  max-width: 640px;
  margin: 150px auto 0 auto;
}

.login__header {
  margin: 0 auto 50px auto;
  text-align: center;
}

.login__item {
  margin-bottom: 10px;
  padding: 0 10px 0 10px;

  input {
    display: block;
    width: 300px;
    height: 50px;
    border: 1px solid #757575;
    margin: 0 auto;
    padding-left: 10px;
  }

  button {
    display: block;
    width: 300px;
    height: 50px;
    margin: 20px auto;
    background-color: #0288d1;
    color: white;
  }
}
</style>
