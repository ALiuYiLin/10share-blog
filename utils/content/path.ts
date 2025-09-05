import path from "path"
import { fileURLToPath } from 'url';
import { readAllFilesAsync, removeExtension } from "../file";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export async function getBlogPaths() {
  const dirPath =  path.resolve(__dirname,'../blogs')
  
  const filePaths = await readAllFilesAsync(dirPath)

  return filePaths.map(filePath=>{
    const resolvedPath = path.relative(dirPath,removeExtension(filePath))
    return resolvedPath
  })
}  