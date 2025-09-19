// https://nuxt.com/docs/api/configuration/nuxt-config
import path from "path";
import { createSvgIconsPlugin } from "vite-plugin-svg-icons";
import { nuxtHooks } from "./hooks";
import { docsRoot, projectRoot } from "./utils";
import { glob } from "fs";

export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  hooks: nuxtHooks, 
  app: {
    head: {
      script: [
        {
          type: "importmap",
          innerHTML: JSON.stringify({
            imports: {
              // 配置包名到 URL 的映射（示例：Vue 3）
              vue: "https://unpkg.com/vue@3/dist/vue.esm-browser.js",
              // 其他库（如 vue-router）
              "vue-router":
                "https://unpkg.com/vue-router@4/dist/vue-router.esm-browser.js",
            },
          }),
          crossorigin: "anonymous",
          // 避免被 Nuxt 自动处理（如哈希、预加载）
          nomodule: false,
        },
      ],
    },
  },
  vite: {
    build:{
      sourcemap: true,
      ssrManifest:'.vie/ssr-manifest.json'
    },
    plugins: [
      createSvgIconsPlugin({
        iconDirs: [path.resolve(__dirname, "app/assets/icons")],
        symbolId: "icon-[dir]-[name]",
      }),
      {
        name:'md-hrm',
        configureServer(server){
          glob(path.resolve(projectRoot,"docs/**/*.md"),(err,files)=>{
            if(err) return
            files.forEach((file)=>{
              server.watcher.add(file)
            })
            server.watcher.on('change',(file)=>{
              if(file.endsWith('.md')){
                console.log(`[md-hmr] ${file} changed, reloading...`)
                server.ws.send({
                  type:'custom',
                  event:'md:hrm',
                  data: {
                    path: path.relative(docsRoot,file).replace('.md','')
                  }
                })
              }
            })
          })
        }
      }
    ],
  },
});
