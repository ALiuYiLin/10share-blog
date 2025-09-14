import { copySync } from "fs-extra";
import { NuxtHooks } from "nuxt/schema";
import { baseTsConfigPath, devBaseTsConfigPath, devDocsRoot, docsRoot, outputDocsRoot } from "../../utils";

export const useBuildBefore: NuxtHooks["build:before"] = () => {
  // copy docs to .nuxt/docs
  copySync(docsRoot, devDocsRoot, { overwrite: true, errorOnExist: false });
  console.log(`成功复制${docsRoot}=>${devDocsRoot}`);
  // copy docs to .output/docs
  copySync(docsRoot, outputDocsRoot, { overwrite: true, errorOnExist: false });
  console.log(`成功复制${docsRoot}=>${outputDocsRoot}`);
  // copy tsconfig.base.json to .nuxt/tsconfig.base.json
  copySync(baseTsConfigPath, devBaseTsConfigPath, { overwrite: true, errorOnExist: false });
  console.log(`成功复制${baseTsConfigPath}=>${devBaseTsConfigPath}`);

};
