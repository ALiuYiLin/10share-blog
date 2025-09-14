import { createRollupInstance, fsVol } from "@@/instance";
import { createFsFromVolume, Volume } from "memfs";
import fs from 'fs'
import { rollup } from "rollup";
import { appRoot, devCssDir, devCssPath, projectRoot } from "@@/utils";
import vuePlugin from "@vitejs/plugin-vue";
import esbuild from "rollup-plugin-esbuild";
import { createSvgIconsPlugin } from "vite-plugin-svg-icons";
import path from "path";
import postcss from 'rollup-plugin-postcss'; // 处理 CSS/SCSS
import commonjs from 'rollup-plugin-commonjs';

import nodeResolve from '@rollup/plugin-node-resolve';
import css from 'rollup-plugin-css-only';


export default defineEventHandler(async (event) => {
  const str = `\
  <template>
  <div>
    <h1>test1</h1>
    <test name="more"></test>
  </div>
</template>

<script lang="ts" setup>
import test from '@/components/test.vue';
</script>
  `;
  // await fsVol.promises.writeFile('@virtual/virtual.vue',str,{encoding:'utf-8'})
  const vol = Volume.fromJSON({
    "virtual.vue": str,
  });
  const fsVol = createFsFromVolume(vol);
  const myfs = {
    promises: {
      readFile: (filePath: string, options?: any) => {
        if (filePath === "virtual.vue")
          return fsVol.promises.readFile(filePath, options);
        else return fs.promises.readFile(filePath, options);
      },
    },
  };

  const bundle = await rollup({
    input: ["virtual.vue"],
    // input: ["@/client/pages/home.vue"],
    //@ts-ignore
    fs: myfs.promises,
    
    external: ["vue"],
    plugins: [
      {
        name: "virtual-component-plugin",
        resolveId(source) {
          console.log('source: ', source);
          if (source.startsWith("@/")) {
            return source
              .replace("@/", appRoot + "\\")
              .replaceAll("\\", "/");
          }
          return source;
        },
      },

      createSvgIconsPlugin({
        iconDirs: [path.resolve(appRoot, "app/assets/icons")],
        symbolId: "icon-[dir]-[name]",
      }),
      // @ts-ignore
      css({
        // output: devCssPath
        // output: './xxx.css'
        output:(styles,styleNodes,bundle)=> {
          
        }
      }),
      vuePlugin(),
      nodeResolve(),
      commonjs(),
      esbuild({
        // sourceMap: true,
        logLevel: "verbose",
        target: "es2022",
        optimizeDeps:{
          esbuildOptions: {},
          include: []
        },
        sourceMap: false,
        loaders: {
          ".vue": "ts",
        },
      
      })
    ],
  });
  const { output } = await bundle.generate({ format: "es" });
  console.log("output: ", output[0].code);

  return "";
});
