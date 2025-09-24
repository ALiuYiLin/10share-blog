declare module '*.vue' {
  import type { DefineComponent } from 'vue';
  // 定义 .vue 文件的导出类型（适用于 Vue 3）
  const component: DefineComponent<{}, {}, any>;
  export default component;
}