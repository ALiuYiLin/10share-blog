import { Api, DOCS_ROOT } from "#/utils";
import { glob } from "glob";
import path from "path";
export const getDocs:Api = {
  path: "/docs",
  method: "get",
  apiHandler: async () => {    
    const files = await glob(DOCS_ROOT+'/**/*.md',{absolute:true})
    console.log("@@@!3424");
    return files.map(file=>path.relative(DOCS_ROOT,file).replace(".md",""))
  },
};
