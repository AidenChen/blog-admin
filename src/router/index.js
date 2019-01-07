import Vue from 'vue';
import Router from 'vue-router';
import Dashboard from '@/views/dashboard';
import Home from '@/views/home';
import Post from '@/views/post';
import PostList from '@/views/post/post-list';
import PostEditor from '@/views/post/post-editor';
import Tag from '@/views/tag';
import TagList from '@/views/tag/tag-list';
import Login from '@/views/login';

Vue.use(Router);

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/dashboard',
      component: Dashboard,
      children: [
        {
          path: '',
          name: 'home',
          component: Home,
        },
        {
          path: 'posts',
          component: Post,
          children: [
            {
              path: '',
              name: 'post-list',
              component: PostList,
            },
            {
              path: 'editor',
              name: 'post-editor',
              component: PostEditor,
            },
          ],
        },
        {
          path: 'tags',
          component: Tag,
          children: [
            {
              path: '',
              name: 'tag-list',
              component: TagList,
            },
          ],
        },
      ],
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
    },
    {
      path: '*',
      redirect: '/login',
    },
  ],
});
