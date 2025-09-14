import { fsVol } from "../../instance";
import fs from "fs";
const virtualFile = "virtual.vue";

export const virtualAndRealFs = {
  promises: {
    readFile: (path: string, options?: any) => {
      if (path === virtualFile){
        console.log('read with fsVol:',path);
        return fsVol.promises.readFile(path, options)
      }
      console.log('read with fs:',path);
      return fs.promises.readFile(path, options);
    }
  },
};
