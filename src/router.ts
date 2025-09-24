import {
  createRouter as _createRouter,
  createMemoryHistory,
  createWebHashHistory,
  RouteRecordRaw,
} from 'vue-router'

export const routes:RouteRecordRaw[] = [
  {
    path:'/',
    name: 'home',
    component: ()=> import('./pages/home.vue')
  },
  {
    path:'/test',
    name: 'test',
    component: ()=> import('./pages/test.vue')
  },
  {
    path:'/docs',
    name: 'docs',
    component: ()=> import('./pages/docs.vue')
  }
] as const

export function createRouter(){
  return _createRouter(
    {
      //@ts-ignore
      history: import.meta.env.SSR
      ? createMemoryHistory()
      : createWebHashHistory(),
      routes
    }
  )
}