import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export const projectRoot = path.resolve(__dirname,"../..")
export const outPutDir = path.resolve(projectRoot,".output")
export const blogsDir = path.resolve(projectRoot,'blogs')
export const outPutBlogsDir = path.resolve(outPutDir,'server/blogs')
export const devBlogsDir = path.resolve(outPutDir,'.nuxt/blogs')
