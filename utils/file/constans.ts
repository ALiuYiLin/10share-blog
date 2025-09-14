import path from "path";
import { fileURLToPath } from "url";
const __dirname = path.dirname(fileURLToPath(import.meta.url))
export const projectRoot = path.resolve(__dirname,'../..')
export const appRoot = path.resolve(projectRoot,'app')
export const devCssPath = path.resolve(projectRoot,'.nuxt/bundle.css')
export const devCssDir = path.resolve(projectRoot,'.nuxt/css')
export const outputRoot = path.resolve(projectRoot,'.output')
export const docsRoot = path.resolve(projectRoot,'docs')
export const outputDocsRoot = path.resolve(projectRoot,'.output/server/docs')
export const devDocsRoot = path.resolve(projectRoot,'.nuxt/docs')
export const baseTsConfigPath = path.resolve(projectRoot,'tsconfig.base.json')
export const devBaseTsConfigPath = path.resolve(projectRoot,'.nuxt/tsconfig.base.json')
export const appComponents = path.resolve(projectRoot,'app/components')

