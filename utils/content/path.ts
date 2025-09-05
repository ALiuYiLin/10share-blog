import path from "path"
import { readAllFilesAsync, removeExtension } from "../file";
import { devBlogsDir, outPutBlogsDir } from "../constant";

export async function getBlogPaths() {
  let dirPath = ''
  if(process.env.NODE_ENV == 'production'){
    dirPath =  outPutBlogsDir
  }
  else dirPath =  devBlogsDir
  
  const filePaths = await readAllFilesAsync(dirPath)

  return filePaths.map(filePath=>{
    const resolvedPath = path.relative(dirPath,removeExtension(filePath))
    return resolvedPath
  })
}  