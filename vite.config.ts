import { defineConfig } from "vite";
import vuePlugin from '@vitejs/plugin-vue'
import path from "path";
import { fileURLToPath } from "url";
const __dirname = path.dirname(fileURLToPath(import.meta.url))
export default defineConfig(()=>({
  resolve:{
    alias:{
      "@": path.resolve(__dirname,"src"),
      "#": path.resolve(__dirname,'server')
    }
  },
  publicDir:"./public",
  plugins:[
    vuePlugin()
  ]
}))