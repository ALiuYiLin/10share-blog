import { blogsDir, outPutBlogsDir } from "../../constant"
import { copyDir } from "../../file"

export const copyBlogsNitroHook = {
  close: () => {
      copyDir(blogsDir,outPutBlogsDir)
  }
}