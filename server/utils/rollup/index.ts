import { InputPluginOption, rollup, RollupOptions } from "rollup";
import vuePlugin from "@vitejs/plugin-vue";
import { createRequire } from "module";
import esbuild from "rollup-plugin-esbuild";
import alias from '@rollup/plugin-alias';
import { APP_ROOT } from "..";

const require = createRequire(import.meta.url);
const postcss = require("rollup-plugin-postcss");


const virtualFile = 'virtual.vue'


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
      alias({
      entries: [
        { find: '@', replacement: APP_ROOT },
      ]
    }),
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