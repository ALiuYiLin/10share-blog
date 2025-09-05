import { NuxtHooks } from "nuxt/schema";
import { copyBlogsNitroHook } from "../nitro";
import { blogsDir, devBlogsDir } from "../../constant";
import { copyDir } from "../../file";

export const nuxtHooks = {
  'nitro:build:public-assets':(nitro)=>{
    nitro.hooks.addHooks(copyBlogsNitroHook)
  },
  'build:before':()=>{
    copyDir(blogsDir,devBlogsDir)
  }
} as NuxtHooks