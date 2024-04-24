import { createRouter, createWebHistory } from 'vue-router';
import Dashboard from '@/layouts/dashboard.vue';
import Login from '@/views/login/index.vue';
import Home from '@/views/home/index.vue';
import Post from '@/views/post/index.vue';
import PostList from '@/views/post/post-list/index.vue';
import PostEdit from '@/views/post/post-edit/index.vue';
import Tag from '@/views/tag/index.vue';
import TagList from '@/views/tag/tag-list/index.vue';

const router = createRouter({
  history: createWebHistory(),
  scrollBehavior: () => ({ top: 0 }),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/',
      component: Dashboard,
      children: [
        {
          path: '',
          name: 'home',
          component: Home
        },
        {
          path: 'posts',
          component: Post,
          children: [
            {
              path: '',
              name: 'post-list',
              component: PostList
            },
            {
              path: 'edit',
              name: 'post-edit',
              component: PostEdit
            }
          ]
        },
        {
          path: 'tags',
          component: Tag,
          children: [
            {
              path: '',
              name: 'tag-list',
              component: TagList
            }
          ]
        }
      ]
    },
    {
      path: '/:pathMatch(.*)',
      redirect: '/login'
    }
  ]
});

export default router;
