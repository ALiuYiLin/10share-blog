
import fs from "fs";
import {getDocsCodeAndCss } from "@@/utils";

export default defineEventHandler(async (event) => {
  const { path } = getQuery<{path:string}>(event)
  return await getDocsCodeAndCss(path);
});