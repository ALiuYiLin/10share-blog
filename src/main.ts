import { createSSRApp } from "vue"
import APP from "./APP.vue"
import { createRouter } from "./router"

export const createApp = ()=>{
  const app = createSSRApp(APP)
  const router = createRouter()
  app.use(router)
  return {app,router}
}