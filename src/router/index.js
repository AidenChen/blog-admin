import Vue from 'vue';
import Router from 'vue-router';
import Admin from '@/components/Admin';
import Login from '@/components/Login';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Admin',
      component: Admin
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
});