import fs from "fs";
import path from "path";
import { devDocsRoot } from "../constans";
import { readAllFilesAsync, removeExtension } from "../file";
export const getAbsDocsPath = (relativePath: string) => {
  const absPath = path.resolve(devDocsRoot, relativePath) + '.md';
  if (fs.existsSync(absPath)) return absPath;
  return undefined;
};

export const getDocsPaths = async () => {

  const filePaths = await readAllFilesAsync(devDocsRoot);

  return filePaths.map((filePath) => {
    const resolvedPath = path.relative(devDocsRoot, removeExtension(filePath));
    return resolvedPath;
  });
};
