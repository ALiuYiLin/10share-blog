import { Api, DOCS_ROOT, Markdwon } from "#/utils";
import fs from 'fs'
import path from "path";
export const renderDocs:Api = {
  path: "/render",
  method: "get",
  apiHandler: async (req) => {    
    const docPath = 'example/index.md'
    const fileString = fs.readFileSync(path.resolve(DOCS_ROOT,docPath),{encoding:'utf-8'})
    const md = new Markdwon()
    md.mdUsePlugins()
    const html = await md.render(fileString)
    return html
  },
};