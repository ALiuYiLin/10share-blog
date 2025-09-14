在日常开发中，我们常常会创建demo去测试我们封装的组件或者页面是否达到了预期的效果，但是这些demo通常会在测试后就删除。

为了便于日后遇到同样的问题能找到对应的demo，今天我们就来封装一个vite-vue的demo项目。

项目要点：

1.  确保每个demo页之间的样式隔离
2.  home页面存在路由，便于导航

## 初始化demo项目

```powershell
npm create vite@latest 
```

项目结构

![image.png](https://p0-xtjj-private.juejin.cn/tos-cn-i-73owjymdk6/a67f2ddab0b641e7832fdcc60bf648cc~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAgMTBzaGFyZQ==:q75.awebp?policy=eyJ2bSI6MywidWlkIjoiMzg1MzExOTQ3Njk5MDUyMCJ9&rk3s=f64ab15b&x-orig-authkey=f32326d3454f2ac7e96d3d06cdbb035152127018&x-orig-expires=1757631897&x-orig-sign=Hi3omK4Vm3mq6H3joXN6%2BClV9V0%3D)

## 路径别名配置

配置路径别名，提升代码可维护性，降低输入成本。

```ts
// vite.config.ts
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  resolve:{
    alias: {
      '@' : path.resolve(__dirname,'src')
    }
  },
  plugins: [
    vue()
  ],
})
```

```json
// tsconfig.app.json
{
  "extends": "@vue/tsconfig/tsconfig.dom.json",
  "compilerOptions": {
    "tsBuildInfoFile": "./node_modules/.tmp/tsconfig.app.tsbuildinfo",

    /* Linting */
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "erasableSyntaxOnly": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedSideEffectImports": true,
    "paths": {
      "@/*":["./src/*"] //配置
    }
  },
  "include": ["src/**/*.ts", "src/**/*.tsx", "src/**/*.vue"]
}

```

## 页面路由配置

```ts
// router/index.ts
import { createRouter, createWebHistory, type RouteLocationRaw, type RouteRecordRaw } from 'vue-router'

export const routes:RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/home.vue'),
    meta: {
      title: 'home page'
    }
  },
  {
    path: '/test',
    name: 'test',
    component: () => import('@/views/demo-pages/test/test.vue'),
    meta: {
      title: 'test demo page'
    }
  }, 
]

export const router = createRouter({
  history: createWebHistory(),
  routes
})

export const routerPush = (to: RouteLocationRaw | string): void => {
  router.push(typeof to === 'string' ? {path:to} : to)
}

export const currentPageTitle =  ()=>{
  const title = router.currentRoute.value.meta.title
  return title ? title : ''
}
```

创建home页面，并将所有路由导航添加到该页面

```vue
// home.vue
<script lang="ts" setup>
import { routerPush, routes } from '@/router';
</script>
<template>
  <div>
    <ul>
      <li v-for="route in routes" :key="route.name" @click="routerPush(route.path)">{{ route.name }}</li>
    </ul>
  </div>
</template>
```

```vue
// app.vue
<script lang="ts" setup>
import { currentPageTitle } from './router';

</script>
<template>
  <div>
    <h1>{{ currentPageTitle() }}</h1>
    <RouterView></RouterView>
  </div>
</template>
```

## 效果

![9月4日.gif](https://p0-xtjj-private.juejin.cn/tos-cn-i-73owjymdk6/67e3b9788dac4589ae46e21dceea60ae~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAgMTBzaGFyZQ==:q75.awebp?policy=eyJ2bSI6MywidWlkIjoiMzg1MzExOTQ3Njk5MDUyMCJ9&rk3s=f64ab15b&x-orig-authkey=f32326d3454f2ac7e96d3d06cdbb035152127018&x-orig-expires=1757631897&x-orig-sign=a%2F%2B%2FoExnu%2Bb6%2FDYbxcw0SRGzeMI%3D)

项目地址(<https://github.com/ALiuYiLin/10share-demos>)
