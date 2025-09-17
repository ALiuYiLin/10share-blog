import { InputOption, rollup } from "rollup";
import { appRoot,virtualAndRealFs } from "../../utils";
import vue from "rollup-plugin-vue";
import esbuild from "rollup-plugin-esbuild";
import { createRequire } from "module";
import path from "path";

const require = createRequire(import.meta.url);
const postcss = require("rollup-plugin-postcss");


export const createRollupInstance = async () => {
  function build(input:InputOption) {
    return rollup({
      input,
      // @ts-ignore
      fs:virtualAndRealFs.promises,

      external: ['vue'],

      plugins:[
        {
          name:'path-resolve-plugin',
          resolveId(source, importer, options) {
              if(source.startsWith('.')){
                if(importer) return path.resolve(path.dirname(importer),source)
              }
              if(source.startsWith("@/")){
                return source.replace("@/",appRoot+'/')
              }
              return source
          },
        },
        vue({
          preprocessStyles: true,
        }),
        postcss({
          inject: true,
        }),
        esbuild({
          // sourceMap: true,
          logLevel: "verbose",
          target: "es2022",
          loaders: {
            ".vue": "ts",
          },
        })
      ]

    });
  }

  return {
    build,
  };
};
