import { InputOption, rollup } from "rollup";
import { appComponents, projectRoot, virtualAndRealFs } from "../../utils";
import vuePlugin from "@vitejs/plugin-vue";
import esbuild from "rollup-plugin-esbuild";
import alias from '@rollup/plugin-alias';

export const createRollupInstance = async () => {
  function build(input:InputOption) {
    return rollup({
      input,
      // @ts-ignore
      fs:virtualAndRealFs.promises,

      external: ['vue'],

      plugins:[
        alias({
          entries:[
            {
              find:'@/components',replacement:appComponents
            }
          ]
        }),
        vuePlugin(),
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
