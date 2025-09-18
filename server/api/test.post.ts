import { compile, createMarkdownInstance,fsVol } from "@@/instance";
import { MarkdownSfcBlocks } from "@mdit-vue/plugin-sfc";
import fs from 'fs'
import path from "path";
import { docsRoot } from "~~/utils";

function getVueSrc(sfcBlocks:MarkdownSfcBlocks,html:string){
  const vueSrc = [
      ... sfcBlocks?.scripts.map((item) => item.content) ?? [],
      `<template><div>${html}</div></template>`,
      ...(sfcBlocks?.styles.map((item) => item.content) ?? []),
      ...(sfcBlocks?.customBlocks.map((item) => item.content) ?? [])
    ].join('\n')
  return vueSrc
}

export default defineEventHandler(async (event) => {

  const fileString = fs.readFileSync(path.resolve(docsRoot,'example/vue.md'),'utf-8')

  const md = await createMarkdownInstance();
  const env = {} as {sfcBlocks:MarkdownSfcBlocks}
  
  const html = await md.renderAsync(fileString,env)
  console.log('html: ', html);


  const {sfcBlocks} = env
  const appStr = getVueSrc(sfcBlocks,html)
  console.log('appStr: ', appStr);

  const ff = fsVol.getInstance()
  await ff.promises.writeFile('virtual.vue',appStr,{encoding:'utf-8'})
  const input = ['virtual.vue']  
  return await compile(input)

});