// https://nuxt.com/docs/api/configuration/nuxt-config
import { nuxtHooks } from './utils'

export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  hooks:nuxtHooks
});
