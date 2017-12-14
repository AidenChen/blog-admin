<template>
  <div id="app">
    <!-- <img src="./assets/logo.png"> -->
    <transition name="fade" mode="out-in">
      <router-view/>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'app',
};
</script>

<style lang="scss">
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;

  .fade-enter-active, .fade-leave-active {
    transition: all 0.5s;
  }
      
  .fade-enter, .fade-leave-active {
    opacity: 0;
  }
      
  .fade-enter {
    transform: translateX(50px);
  }
    
  .fade-leave-active {
    transform: translateX(-50px);
  }
}
</style>
