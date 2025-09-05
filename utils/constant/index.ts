import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export const projectRoot = path.resolve(__dirname,"../..")
export const scf_bootstrap = path.resolve(projectRoot,"scf_bootstrap")

export const outPutDir = path.resolve(projectRoot,".output")
export const output_scf_bootstrap = path.resolve(outPutDir,"scf_bootstrap")
export const blogsDir = path.resolve(projectRoot,'blogs')
export const outPutBlogsDir = path.resolve(outPutDir,'server/blogs')
export const devBlogsDir = path.resolve(outPutDir,'.nuxt/blogs')
