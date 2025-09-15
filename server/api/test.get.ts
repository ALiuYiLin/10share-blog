import { createRollupInstance, fsVol } from "@@/instance";
import { createFsFromVolume, Volume } from "memfs";
import fs from "fs";
import { rollup } from "rollup";
import { appComponents, appRoot, devCssDir, devCssPath, projectRoot } from "@@/utils";
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
import { readAllFilesAsync } from "~~/utils/file/file";

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
  const components =  await readAllFilesAsync(appComponents)
  const manifestJson:Record<string,{
    fileName: string,
    imports: string[],
    isEntry: boolean
  }> = JSON.parse(fs.readFileSync('dist/manifest.json',{encoding:'utf-8'})) 

  const bundle = await rollup({
    input: [...components,"virtual.vue"],
    // input: ["@/client/pages/home.vue"],
    //@ts-ignore
    fs: myfs.promises,
    external: ["vue"],
    plugins: [
      {
        name: "virtual-component-plugin",
        resolveId(source,importer,options) {
          console.log("source: ", source);
          if(source.startsWith('.')){
            let newPath =''
            if(importer) newPath = path.resolve(path.dirname(importer),source)
            return newPath
          }
          
          
          if (source.startsWith("@/")) {
            return source.replace("@/", appRoot + "\\").replaceAll("\\", "/");
          }
          if(Object.keys(manifestJson).includes(source)){
            const xpath = path.resolve(projectRoot,'dist',manifestJson[source].fileName).replaceAll('\\','/')
            console.log('projectRoot: ', projectRoot);
            console.log('xpath: ', xpath);
   
            return path.resolve(projectRoot,'dist',manifestJson[source].fileName).replaceAll('\\','/')
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
      nodeResolve({
        extensions:['.js','.ts','.vue']
      }),
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
  const { output } = await bundle.generate({format:'esm'})


  // const { output } = await bundle.write({ 
  //   format: "esm",
  //   dir: 'dist',
  //   entryFileNames: 'entry/[name]-[hash].js',   // 入口文件
  //   chunkFileNames: 'chunk/[name]-[hash].js',   // 代码分割后的 chunk
  //   assetFileNames: 'assets/[name]-[hash][extname]',
  // })

  // // 生成映射
  // const manifest:Record<string,any> = {};
  // for (const chunkOrAsset of output) {
  //   if (chunkOrAsset.type === 'chunk') {
  //     if(!chunkOrAsset.facadeModuleId) continue
  //     const fileNmae = chunkOrAsset.facadeModuleId.replaceAll('\\','/')
  //     manifest[fileNmae] = {
  //       fileName: chunkOrAsset.fileName,
  //       imports: chunkOrAsset.imports,     // 引入的 chunk
  //       isEntry: chunkOrAsset.isEntry,
  //     };
  //   } else if (chunkOrAsset.type === 'asset') {
  //     // @ts-ignore
  //     manifest[chunkOrAsset.name] = {
  //       fileName: chunkOrAsset.fileName,
  //       source: chunkOrAsset.source,
  //     };
  //   }
  // }

  // fs.writeFileSync('dist/manifest.json', JSON.stringify(manifest, null, 2));

  console.log("output: ",output[0].code);
  return "";
});
