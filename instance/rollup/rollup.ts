import { InputOption, rollup } from "rollup";
import { appRoot, virtualAndRealFs } from "../../utils";
import vuePlugin from "@vitejs/plugin-vue";
import esbuild from "rollup-plugin-esbuild";
import { createRequire } from "module";
import path from "path";
import prefixer from 'postcss-prefix-selector';

const require = createRequire(import.meta.url);
const postcss = require("rollup-plugin-postcss");

function parseVueRequest(id: string) {
  const [filename, rawQuery] = id.split(`?`, 2);
  const query: any = Object.fromEntries(new URLSearchParams(rawQuery));
  const scopedId = query.scoped;
  if (query.vue != null) query.vue = true;
  if (query.index != null) query.index = Number(query.index);
  if (query.raw != null) query.raw = true;
  if (query.url != null) query.url = true;
  if (query.scopedscoped != null) query.scoped = true;
  return {
    filename,
    query,
    scopedId,
  };
}

export async function compile(input: InputOption) {
  const cssArr: string[] = [];
  const bundle = await rollup({
    input,
    // @ts-ignore
    fs: virtualAndRealFs.promises,

    external: ["vue"],

    plugins: [
      {
        name: "path-resolve-plugin",
        resolveId(source, importer, options) {
          if (source.startsWith(".")) {
            if (importer) return path.resolve(path.dirname(importer), source);
          }
          if (source.startsWith("@/")) {
            return source.replace("@/", appRoot + "/");
          }
          return source;
        },
      },
      vuePlugin(),
      postcss({
        inject: false,
        plugins: [
          prefixer({
            prefix: '.vp-doc'
          })
        ]
      }),
      {
        name: "log-css",
        transform(code, id) {
          if(id.endsWith('lang.css')){
              const match = code.match(/export\s+var\s+stylesheet\s*=\s*"([^"]*)"/);
              if (match) cssArr.push(JSON.parse(`"${match[1]}"`))
          }
        }
      },
      esbuild({
        target: "es2022",
        loaders: {
          ".vue": "ts",
        },
      }),
    ],
  });

 const {output} = await bundle.generate({format:'esm'})

 return {
  code:output[0].code,
  cssString: cssArr.join('\n')
 }
}
