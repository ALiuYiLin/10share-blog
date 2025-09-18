
import fs from 'fs'
import path from 'path';
import { docsRoot } from '../file';
import { compile, createMarkdownInstance, fsVol } from '../../instance';
import { MarkdownSfcBlocks } from '~~/shared';

function getVueSrc(sfcBlocks:MarkdownSfcBlocks,html:string){
  const vueSrc = [
      ... sfcBlocks?.scripts.map((item) => item.content) ?? [],
      `<template><div>${html}</div></template>`,
      ...(sfcBlocks?.styles.map((item) => item.content) ?? []),
      ...(sfcBlocks?.customBlocks.map((item) => item.content) ?? [])
    ].join('\n')
  return vueSrc
}

export async function getDocsCodeAndCss(docsPath:string){
  const fileString = fs.readFileSync(path.resolve(docsRoot,docsPath+'.md'),'utf-8')
  const md = await createMarkdownInstance();
  const env = {} as {sfcBlocks:MarkdownSfcBlocks}
  const html = await md.renderAsync(fileString,env)
  const {sfcBlocks} = env
  const appStr = getVueSrc(sfcBlocks,html)
  await fsVol.getInstance().promises.writeFile('virtual.vue',appStr,{encoding:'utf-8'})
  const input = ['virtual.vue']  
  return await compile(input)
}