import { blogsDir, output_scf_bootstrap, outPutBlogsDir, scf_bootstrap } from "../../constant"
import { copyDir } from "../../file"

export const copyBlogsNitroHook = {
  close: () => {
      copyDir(blogsDir,outPutBlogsDir)
      copyDir(scf_bootstrap,output_scf_bootstrap)
  }
}