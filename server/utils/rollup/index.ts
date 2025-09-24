import { InputOption, InputPluginOption, rollup, RollupOptions } from "rollup";
import fs from 'fs'
import vuePlugin from "@vitejs/plugin-vue";
import { createRequire } from "module";
import esbuild from "rollup-plugin-esbuild";

const require = createRequire(import.meta.url);
const postcss = require("rollup-plugin-postcss");


const virtualFile = 'virtual.vue'


function getMyFs(content:string){
  return {
    promises: {
      readFile: (path:string, options?: any)=>{
        if(path === virtualFile) return new Promise((resolve,reject)=>{
          resolve(content)
        })
        return fs.promises.readFile(path,options)
      }
    }
  }
}


export class VueCompile     {
  plugins:InputPluginOption[] = []
  cssArr:string[] = []
  vueSrc:string = ''
  constructor(vueSrc:string){
    this.vueSrc = vueSrc
    const _this = this
    this.plugins = [
      {
        name:'virtual-load',
        resolveId(source){
          if(source === virtualFile) return source
        },
        load(id) {
          if(id === virtualFile) return _this.vueSrc
        },
      },
      vuePlugin(),
      postcss({inject: false}),
      {
        name: 'style-extract',
        transform(code, id) {
          if(id.endsWith('lang.css')){
            const match = code.match(/export\s+var\s+stylesheet\s*=\s*"([^"]*)"/);
            if (match) _this.cssArr.push(JSON.parse(`"${match[1]}"`))
          }
        },
      },
      esbuild({
        target: "es2022",
        loaders: {
          ".vue": "ts",
        },
      })
    ]
  }
  async compile(){
    const bundle = await rollup({
      input:['virtual.vue'],
      external: ['vue'],
      plugins: this.plugins
    })
    return {
      code: (await bundle.generate({format:'es'})).output[0].code,
      css: this.cssArr.join('\n')
    }
  }
}