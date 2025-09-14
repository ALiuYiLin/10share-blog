
import fs from "fs";
import { getAbsDocsPath } from "@@/utils";
import { createMarkdownInstance } from "@@/instance";

export default defineEventHandler(async (event) => {
  const { path } = getQuery<{path:string}>(event)
  // covert path to abs path
  const absDocsPath = getAbsDocsPath(path)
  console.log('absDocsPath: ', absDocsPath);
  if(!absDocsPath) return '';

  const md = await createMarkdownInstance();
  const content = await fs.readFileSync(absDocsPath, "utf-8");
  return await md.renderAsync(content);
});