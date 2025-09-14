import { NuxtHooks } from "nuxt/schema";
import { useBuildBefore } from "./use-build-before";

export const nuxtHooks = {  
  'build:before':useBuildBefore
} as NuxtHooks