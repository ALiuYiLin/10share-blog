import { createRollupInstance, fsVol } from "@@/instance";
import { createFsFromVolume, Volume } from "memfs";
import fs from "fs";
import { rollup } from "rollup";
import { appRoot, devCssDir, devCssPath, projectRoot } from "@@/utils";
import vuePlugin from "@vitejs/plugin-vue";
import esbuild from "rollup-plugin-esbuild";
import { createSvgIconsPlugin } from "vite-plugin-svg-icons";
import path from "path";
// import postcss from 'rollup-plugin-postcss'; // 处理 CSS/SCSS
import { createRequire } from "module";
import commonjs from "rollup-plugin-commonjs";
import vue from "rollup-plugin-vue";

const require = createRequire(import.meta.url);

const postcss = require("rollup-plugin-postcss");

import nodeResolve from "@rollup/plugin-node-resolve";
import css from "rollup-plugin-css-only";

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
      mkdir: (filePath:string,options?:any) =>{
        if (filePath === "virtual.vue")
          return fsVol.promises.mkdir(filePath, options);
        return fs.promises.mkdir(filePath,options)
      },
      writeFile: (filePath:string,data?:any,options?:any)=>{
        if (filePath === "virtual.vue")
          return fsVol.promises.writeFile(filePath, data,options);
        return fs.promises.writeFile(filePath,data,options)
      }

    },
  };

  const bundle = await rollup({
    input: ["@/components/test.vue","virtual.vue"],
    // input: ["@/client/pages/home.vue"],
    //@ts-ignore
    fs: myfs.promises,
    external: ["vue"],
    plugins: [
      {
        name: "virtual-component-plugin",
        resolveId(source) {
          console.log("source: ", source);
          if (source.startsWith("@/")) {
            return source.replace("@/", appRoot + "\\").replaceAll("\\", "/");
          }
          return source;
        },
      },

      createSvgIconsPlugin({
        iconDirs: [path.resolve(appRoot, "app/assets/icons")],
        symbolId: "icon-[dir]-[name]",
      }),
      vue({
        preprocessStyles: true,
      }),
      postcss({
        inject: true,
      }),
      nodeResolve(),
      commonjs(),
      esbuild({
        // sourceMap: true,
        logLevel: "verbose",
        target: "es2022",
        optimizeDeps: {
          esbuildOptions: {},
          include: [],
        },
        sourceMap: false,
        loaders: {
          ".vue": "ts",
        },
      }),
    ],
  });
  const { output } = await bundle.write({ 
    format: "esm",
    dir: 'dist',
    entryFileNames: 'js/[name]-[hash].js',   // 入口文件
    chunkFileNames: 'js/[name]-[hash].js',   // 代码分割后的 chunk
    assetFileNames: ({ name }) => {
      if (/\.(css)$/.test(name ?? '')) {
        return 'css/[name]-[hash][extname]'; // 样式文件
      }
      return 'assets/[name]-[hash][extname]'; // 其他资源
    }
   });
  console.log("output: ", output[0].code);

  return "";
});
