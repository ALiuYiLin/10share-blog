// router/index.ts

import type { RouterConfig } from 'nuxt/schema';

export default {
  // https://router.vuejs.org/api/interfaces/routeroptions.html#routes
  hashMode: true,
  scrollBehaviorType: 'smooth',
  routes: (_routes) => [
    {
      name: 'home',
      path: '/',
      component: () => import('@/pages/index.vue')
    },
    {
      name: 'test',
      path: '/test',
      component: () => import('@/pages/test.vue')
    },
    {
      name: 'blog',
      path: '/blog',
      component: () => import('@/pages/blog.vue')
    },
    {
      name: 'edit',
      path: '/edit',
      component: () => import('@/pages/edit.vue')
    }
  ],
} satisfies RouterConfig