import { InputOption, rollup } from "rollup";
import { appRoot, virtualAndRealFs } from "../../utils";
import vue from "rollup-plugin-vue";
import vuePlugin from "@vitejs/plugin-vue";
import esbuild from "rollup-plugin-esbuild";
import { createRequire } from "module";
import path from "path";
import { compileStyleAsync, parse } from "vue/compiler-sfc";
import { inject } from "vue";
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

export const createRollupInstance = async () => {
  function build(input: InputOption) {
    const cssArr: string[] = [];
    return rollup({
      input,
      // @ts-ignore
      fs: virtualAndRealFs.promises,

      external: ["vue"],

      plugins: [
        {
          name: "path-resolve-plugin",
          resolveId(source, importer, options) {
            console.log("source: ", source);
            if (source.startsWith(".")) {
              if (importer) return path.resolve(path.dirname(importer), source);
            }
            if (source.startsWith("@/")) {
              return source.replace("@/", appRoot + "/");
            }
            return source;
          },
          async load(id) {
            if (id.includes("scoped=")) {
              const source = await this.fs.readFile(id.split("?")[0], {
                encoding: "utf8",
              });
              const { filename, query, scopedId } = parseVueRequest(id);
              const { descriptor, errors } = parse(source);
              const res = await compileStyleAsync({
                id: `data-v-${scopedId}`,
                source: descriptor.styles[query.index].content,
                filename: filename,
                scoped: true,
              });
              cssArr.push(res.code);
              // console.log('res: ', res);
              return undefined;
            }
            return undefined;
          },
        },
        vuePlugin(),
        // vue({
        //   preprocessStyles: true,
        // }),
        postcss({
          inject: true
        }),
        esbuild({
          // sourceMap: true,
          logLevel: "verbose",
          target: "es2022",
          loaders: {
            ".vue": "ts",
          },
        }),
      ],
    });
  }

  return {
    build,
  };
};

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
          console.log("source: ", source);
          if (source.startsWith(".")) {
            if (importer) return path.resolve(path.dirname(importer), source);
          }
          if (source.startsWith("@/")) {
            return source.replace("@/", appRoot + "/");
          }
          return source;
        },
        async load(id) {
          if (id.includes("scoped=")) {
            const source = await this.fs.readFile(id.split("?")[0], {
              encoding: "utf8",
            });
            const { filename, query, scopedId } = parseVueRequest(id);
            const { descriptor, errors } = parse(source);
            const res = await compileStyleAsync({
              id: `data-v-${scopedId}`,
              source: descriptor.styles[query.index].content,
              filename: filename,
              scoped: true,
            });
            cssArr.push(res.code);
            // console.log('res: ', res);
            return undefined;
          }
          return undefined;
        },
      },
      vuePlugin(),
      // vue({
      //   preprocessStyles: true,
      // }),
      postcss({
        inject: false
      }),
      esbuild({
        // sourceMap: true,
        logLevel: "verbose",
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
