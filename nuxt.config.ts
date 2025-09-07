// https://nuxt.com/docs/api/configuration/nuxt-config
import path from 'path';
import { nuxtHooks } from './utils'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons';

export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  hooks:nuxtHooks,
  vite:{
    plugins:[
      createSvgIconsPlugin({
        iconDirs:[path.resolve(__dirname,'app/assets/icons')],
        symbolId: 'icon-[dir]-[name]'
      })
    ]
  }
});
