import { Api, DOCS_ROOT, Markdwon } from "#/utils";
import fs from 'fs'
import path from "path";
import { MarkdownSfcBlocks } from "@mdit-vue/plugin-sfc";
import { VueCompile } from "#/utils/rollup";

function getVueSrc(sfcBlocks:MarkdownSfcBlocks,html:string){
  const vueSrc = [
      ... sfcBlocks?.scripts.map((item) => item.content) ?? [],
      `<template><div>${html}</div></template>`,
      ...(sfcBlocks?.styles.map((item) => item.content) ?? []),
      ...(sfcBlocks?.customBlocks.map((item) => item.content) ?? [])
    ].join('\n')
  return vueSrc
}

export const renderDocs:Api = {
  path: "/render",
  method: "get",
  apiHandler: async (req) => {    
    const docPath = 'example/index.md'
    const fileString = fs.readFileSync(path.resolve(DOCS_ROOT,docPath),{encoding:'utf-8'})
    const md = new Markdwon()
    const env = {} as {sfcBlocks:MarkdownSfcBlocks}
    md.mdUsePlugins()
    const html = await md.render(fileString,env)
    const {sfcBlocks} = env
    const appStr = getVueSrc(sfcBlocks,html)
    const compile = new VueCompile(appStr)
  
    return compile.compile()
  },
};